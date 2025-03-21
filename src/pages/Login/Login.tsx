import React, { useState, ChangeEvent, useEffect } from 'react';
import { validateEmail, validatePassword } from "utils/userValidations";
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

const getApiUrl = (path: string) => {
    const base = process.env.REACT_APP_API_BASE_URL || '';
    const formattedBase = base.endsWith('/') ? base : `${base}/`;
    return `${formattedBase}api/${path.replace(/^api\//, '')}`;
};

interface LoginProps {
    setIsAdminLoggedIn: (isLogged: boolean) => void;
    setIsLoggedIn: (isLogged: boolean) => void;
    adminLogin?: boolean;
}

const Login: React.FC<LoginProps> = ({setIsAdminLoggedIn, setIsLoggedIn, adminLogin}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [generalErrorMessage, setGeneralErrorMessage] = useState("");

    useEffect(() => {
        // Set up event listener for messages from popup
        const handleAuthMessage = (event: MessageEvent) => {
            // Verify origin matches our API for security
            const apiOrigin = new URL(process.env.REACT_APP_API_BASE_URL || '').origin;
            if (event.origin !== apiOrigin) return;

            try {
                if (event.data && event.data.token) {
                    const connectionToken: Connection = {
                        token: event.data.token,
                        userType: UserType.client
                    };
                    
                    setLocalItemWithExpiry(
                        "connection",
                        JSON.stringify(connectionToken),
                        rememberMe ? 5 : 2
                    );
                    
                    checkUserStatus(connectionToken);
                }
            } catch (error) {
                console.error('Error processing auth message:', error);
                setGeneralErrorMessage('Authentication failed. Please try again.');
                setIsLoading(false);
            }
        };

        window.addEventListener('message', handleAuthMessage);
        
        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener('message', handleAuthMessage);
        };
    }, [rememberMe]);

    const checkUserStatus = async (connectionToken: Connection) => {
        try {
            const response = await fetch(getApiUrl("auth/me"), {
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
                    setLocalItemWithExpiry("isLoggedIn", String(true), rememberMe ? 5 : 2);
                    setIsLoggedIn(true);
                    navigate(appRoute.clients.dashboard);
                } else {
                    setUserData(data, connectionToken.token);
                    if (data && data.companies && data.companies.length > 0){
                        setCompanyData(data.companies[data.companies.length - 1]);
                    }
                    navigate(appRoute.clients.registerProcess);
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error gathering data. Please try again.');
                // cleanlocalStorage();
                // alert("Error gathering data. Please try again.");
                // console.error(errorMessage);
                // navigate(appRoute.clients.login);
            }
        } catch (error) {
            console.error('Error gathering data.', error);
            cleanlocalStorage();
            // alert("Error gathering data. Please try again.");
            setGeneralErrorMessage("Error gathering data. Please try again.");
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
        const company: Company = {
            id: data.id,
            name: data?.name || "",
            industryId: data?.industryId || "",
            parentCompanyId: data?.parentCompanyId || null,
            structure: data?.structure || null,
            currentStage: data?.currentStage || null,
            hasRaisedCapital: data?.hasRaisedCapital || null,
            hasW2Employees: data?.hasW2Employees || null,
            hasCompletedSetup: false
        };
        setLocalItemWithExpiry("company", JSON.stringify(company), rememberMe ? 5 : 2);
    }

    const validateForm = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setEmailErrorMessage(emailError);
        setPasswordErrorMessage(passwordError);
        setGeneralErrorMessage("");
        
        return !emailError && !passwordError;
    }; 

    const handleSubmit = () => {
        if (validateForm()) {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        setIsLoading(true);
        setGeneralErrorMessage("");

        const url = adminLogin 
            ? getApiUrl("auth/admin/login") 
            : getApiUrl("auth/login");

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.accessToken;

                let connectionToken: Connection = {
                    token: token,
                    userType: adminLogin ? UserType.admin : UserType.client
                }

                setLocalItemWithExpiry("connection", JSON.stringify(connectionToken), rememberMe ? 5 : 2);

                if (adminLogin) {
                    setIsAdminLoggedIn(true);
                    setLocalItemWithExpiry("isAdminLoggedIn", String(true), rememberMe ? 5 : 1);
                    
                    // setIsAdminLoggedIn(true);
                    navigate(appRoute.admin.dashboard);
                } else {
                    // connectionToken.userType = UserType.client;
                    // setLocalItemWithExpiry("token", token, 0.5);
                    checkUserStatus(connectionToken);
                }
                // setLocalItemWithExpiry("connection", JSON.stringify(connectionToken), 2);

            } else {
                handleLoginError(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setGeneralErrorMessage("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginError = (message: string = '') => {
        switch (message) {
            case "User not found":
                setEmailErrorMessage("User not found");
                break;
            case "Invalid password":
                setPasswordErrorMessage("Invalid password");
                break;
            default:
                setGeneralErrorMessage(message || 'Login failed. Please try again.');
                break;
        }
    };

    const handleRedirectToRegister = () => {
        navigate(appRoute.clients.register);
    };

    const handleRedirectToForgotPassword = () => {
        navigate(appRoute.generic.forgotPassword);
    };

    const handleLoginWithGoogle = () => {
        setIsLoading(true);
        setGeneralErrorMessage("");
        
        // Configure popup features for better compatibility
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
        
        // Open the OAuth popup
        const popup = window.open(
            getApiUrl('auth/google'),
            "googleAuthPopup",
            features
        );
        
        if (!popup) {
            setGeneralErrorMessage("Popup was blocked. Please allow popups for this site.");
            setIsLoading(false);
            return;
        }
        
        // Set timeout to prevent indefinite loading if user abandons the popup
        const timeout = setTimeout(() => {
            if (popup && !popup.closed) {
                popup.close();
            }
            setGeneralErrorMessage("Authentication timed out. Please try again.");
            setIsLoading(false);
        }, 120000); // 2 minute timeout
        
        // Check periodically if popup was closed without completing auth
        const checkClosed = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(checkClosed);
                clearTimeout(timeout);
                // Only show error if we're still loading (no successful auth)
                if (isLoading) {
                    setGeneralErrorMessage("Authentication was cancelled.");
                    setIsLoading(false);
                }
            }
        }, 1000);
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
                            hasErrors={!!emailErrorMessage} 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            disabled={isLoading}
                        />
                         {emailErrorMessage && <S.ErrorLabel htmlFor="email">{emailErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.FormGroup>
                        <S.Label htmlFor="password">Password <span className="required">*</span></S.Label>
                        <S.PasswordContainer>
                            <S.Input
                                hasErrors={!!passwordErrorMessage} 
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <S.ToggleIcon src={showPassword ? HidePasswordIcon : ShowPasswordIcon} onClick={() => setShowPassword(!showPassword)}/>
                        </S.PasswordContainer>
                        {passwordErrorMessage && <S.ErrorLabel htmlFor="password">{passwordErrorMessage}</S.ErrorLabel>}
                        <S.RememberSection>
                            <S.RememberMe>
                                <S.Checkbox type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} disabled={isLoading}/>
                                <S.ForgotPassword>Remember Me</S.ForgotPassword>
                            </S.RememberMe>
                            <S.LabelButton onClick={handleRedirectToForgotPassword} disabled={isLoading}>Forgot Password?</S.LabelButton>
                        </S.RememberSection>
                    </S.FormGroup>
                    <S.Button onClick = {() => handleSubmit()} disabled={isLoading}>Log In</S.Button>
                </S.Form>
                {!adminLogin && <>
                    <S.Separator>&nbsp; Or sign up with &nbsp;</S.Separator>
                    <S.GoogleButton onClick={handleLoginWithGoogle} disabled={isLoading}>
                        <S.GoogleIcon src={GoogleLogoImage} alt="Google" />
                        <span>Google</span>
                    </S.GoogleButton>
                    <S.RegisterContainer>
                        <S.Label>Don’t have an account?</S.Label>
                        <S.LabelButton onClick={handleRedirectToRegister} disabled={isLoading}>Sign Up</S.LabelButton>
                    </S.RegisterContainer>
                </>}
                
            </S.RightContainer>
        </S.Container>
    );
};

export default Login;