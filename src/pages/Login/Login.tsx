import React, { useState, ChangeEvent, useEffect } from 'react';
import { validateEmail, validatePassword } from "utils/userValidations";
import axios from 'axios';
import LogoImage from 'assets/images/BigLogo.png';
import GoogleLogoImage from 'assets/icons/GoogleLogo.png';
import ShowPasswordIcon from 'assets/icons/StatusOn.svg';
import HidePasswordIcon from 'assets/icons/StatusOff.svg';
import * as S from './styles';
import { useNavigate } from 'react-router-dom';
import { serverURL } from 'utils/constants';
import { cleanlocalStorage, getLocalItem, setLocalItemWithExpiry } from 'helper/localStorage.helper';
import { Company, User } from 'utils/interfaces';
import { appRoute } from 'consts/routes.const';
import { Connection } from 'interfaces/login/connection.interface';
import { UserType } from 'interfaces/login/userType.enum';


interface LoginProps {
    setIsAdminLoggedIn: (isLogged: boolean) => void;
    setIsLoggedIn: (isLogged: boolean) => void;
    adminLogin?: boolean;
}

const Login: React.FC<LoginProps> = ({setIsAdminLoggedIn, setIsLoggedIn, adminLogin}) => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const tokenGot = localStorage.getItem("token");
            if (tokenGot) {
                let connectionToken: Connection = {
                    token: JSON.parse(tokenGot).value,
                    userType: UserType.client
                }

                if (connectionToken.token) {
                    clearInterval(interval);
                    setChecking(false);
                    localStorage.removeItem("token");
                    setLocalItemWithExpiry("connection", JSON.stringify(connectionToken), 2);
                    checkUserStatus(connectionToken);
                }
            }

        }, 1000);
    }, [checking]);

    const checkUserStatus = async (connectionToken: Connection) => {

        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL+"api/auth/me", {
                method: "GET", 
                headers: { "Accept": "application/json", "Authorization":  "Bearer "+connectionToken.token || "" },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.hasRegisteredCompanies) {
                    // if (!data.isVerified) {	
                    //     alert("Please verify your email address before logging in.");
                    //     cleanlocalStorage();
                    //     return;	
                    // }
                    setLocalItemWithExpiry("isLoggedIn", String(true), rememberMe ? 5 : 1);
                    setIsLoggedIn(true);
                    navigate(appRoute.clients.dashboard);
                } else {
                    setUserData(data, connectionToken.token);
                    if (data.companies.length > 0){
                        setCompanyData(data.companies[data.companies.length - 1]);
                    }
                    navigate(appRoute.clients.registerProcess);
                }
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error gathering data. Please try again.';
                cleanlocalStorage();
                alert("Error gathering data. Please try again.");
                console.error(errorMessage);
                navigate(appRoute.clients.login);
            }
        } catch (error) {
            console.error('Error gathering data.', error);
            cleanlocalStorage();
            alert("Error gathering data. Please try again.");
            navigate(appRoute.clients.login);
        }
    };

    const setUserData = (data: any, accessToken: string) => {
        let user: User = {
            id: data.id,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            lastPasswordChange: data.lastPasswordChange,
            isVerified: data.isVerified,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            accessToken: accessToken,
        };
        setLocalItemWithExpiry("user", JSON.stringify(user), 2);
    };

    const setCompanyData = (data: any) => {
        let company: Company = {
            id: data.id,
            name: data?.name,
            industryId: data?.industryId ? data?.industryId : "",
            parentCompanyId: data?.parentCompanyId ? data?.parentCompanyId : null,
            structure: data?.structure ? data?.structure : null,
            currentStage: data?.currentStage ? data?.currentStage : null,
            hasRaisedCapital: data?.hasRaisedCapital ? data?.hasRaisedCapital : null,
            hasW2Employees: data?.hasW2Employees ? data?.hasW2Employees : null,
            hasCompletedSetup: false
        };
        setLocalItemWithExpiry("company", JSON.stringify(company), 2);
    }

    const handleSubmit = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setEmailErrorMessage(emailError);
        setPasswordErrorMessage(passwordError);
        if (!emailError && !passwordError) {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        const url = adminLogin ? process.env.REACT_APP_API_BASE_URL+'api/auth/admin/login' : process.env.REACT_APP_API_BASE_URL+'api/auth/login';
        console.log("This is the url ======> ", url)
        // let userString: string | null =  localStorage.getItem('user')
        // if (!userString) {
        //     userString = ''
        // }
        // console.log("This is our userString++++++>", userString)
        // const user: any = JSON.parse(userString)

        try {
            const body = { email, password }
            // console.log("This is our user and accesToknen", user, "AccesToken:", user.accessToken )
            const response: any = await axios.post(url, body,
                //  {headers: {authorization: `Bearer ${user.accessToken}` }}
                )

            console.log("This is the response+++>", response)
{}
            if (response.status === 201) {
                // const data = await response.json();
                const token = response.data.authToken;

                let connectionToken: Connection = {
                    token: token,
                    userType: UserType.admin
                }

                if (adminLogin) {
                    setIsAdminLoggedIn(true);
                    setLocalItemWithExpiry("isAdminLoggedIn", String(true), rememberMe ? 5 : 1);
                    
                    setIsAdminLoggedIn(true);
                    navigate(appRoute.admin.dashboard);
                } else {
                    connectionToken.userType = UserType.client;
                    setLocalItemWithExpiry("token", token, 0.5);
                    checkUserStatus(connectionToken);
                }
                setLocalItemWithExpiry("connection", JSON.stringify(connectionToken), 2);

            }
        } catch (error: any) {
            console.error('Error during login:', error);
            const errorMessage = error.resposnes.data.message || 'Login failed. Please try again.';
            switch (errorMessage) {
                case "User not found":
                    setEmailErrorMessage("User not found");
                    break;
                case "Invalid password":
                    setPasswordErrorMessage("Invalid password");
                    break;
                default:
                    break;
            }
        }
    };

    const handleRedirectToRegister = () => {
        navigate(appRoute.clients.register);
    };

    const handleRedirectToForgotPassword = () => {
        navigate(appRoute.generic.forgotPassword);
    };

    const handleLoginWithGoogle = () => {
        const popup = window.open(
            serverURL()+"/api/auth/google",
            "authPopup",
            "width=500,height=500"
        );
    
        if (!popup) {
            alert("The popup was blocked by the browser.");
            return;
        }
    
        setChecking(true);
    };

    return (
        <S.Container>
            <S.LeftContainer>
                <S.Image src={LogoImage} alt="Logo" />
            </S.LeftContainer>
            <S.RightContainer>
                <S.LoginTitle>Log in</S.LoginTitle>
                <S.Subtitle>Enter your email and password to login</S.Subtitle>
                <S.Form>
                    <S.FormGroup>
                        <S.Label htmlFor="email">Email <span className="required">*</span></S.Label>
                        <S.Input
                            hasErrors={emailErrorMessage != ""} 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {emailErrorMessage && emailErrorMessage != "" && <S.ErrorLabel htmlFor="email">{emailErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.FormGroup>
                        <S.Label htmlFor="password">Password <span className="required">*</span></S.Label>
                        <S.PasswordContainer>
                            <S.Input
                                hasErrors={passwordErrorMessage != ""} 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <S.ToggleIcon src={showPassword ? HidePasswordIcon : ShowPasswordIcon} onClick={() => setShowPassword(!showPassword)}/>
                        </S.PasswordContainer>
                        {passwordErrorMessage && passwordErrorMessage != "" && <S.ErrorLabel htmlFor="password">{passwordErrorMessage}</S.ErrorLabel>}
                        <S.RememberSection>
                            <S.RememberMe>
                                <S.Checkbox type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                                <S.ForgotPassword>Remember Me</S.ForgotPassword>
                            </S.RememberMe>
                            <S.LabelButton onClick={handleRedirectToForgotPassword}>Forgot Password?</S.LabelButton>
                        </S.RememberSection>
                    </S.FormGroup>
                    <S.Button onClick = {() => handleSubmit()}>Log In</S.Button>
                </S.Form>
                {!adminLogin && <>
                    <S.Separator>&nbsp; Or sign up with &nbsp;</S.Separator>
                    <S.GoogleButton onClick={handleLoginWithGoogle}>
                        <S.GoogleIcon src={GoogleLogoImage} alt="Google" />
                        <span>Google</span>
                    </S.GoogleButton>
                    <S.RegisterContainer>
                        <S.Label>Don’t have an account?</S.Label>
                        <S.LabelButton onClick={handleRedirectToRegister}>Sign Up</S.LabelButton>
                    </S.RegisterContainer>
                </>}
                
            </S.RightContainer>
        </S.Container>
    );
};

export default Login;