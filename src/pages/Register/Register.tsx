import React, { useState, ChangeEvent, useEffect } from 'react';
import { validateEmail, validatePassword } from "utils/userValidations";
import axios from 'axios'
import LogoImage from 'assets/images/BigLogo.png';
import GoogleLogoImage from 'assets/icons/GoogleLogo.png';
import ShowPasswordIcon from 'assets/icons/StatusOn.svg';
import HidePasswordIcon from 'assets/icons/StatusOff.svg';
import * as S from './styles';
import { useNavigate } from 'react-router-dom';
import { serverURL } from 'utils/constants';
import { parseUser } from 'utils/functions';
import { cleanlocalStorage, getLocalItem, setLocalItemWithExpiry } from 'helper/localStorage.helper';
import { appRoute } from 'consts/routes.const';
import { useAuth } from 'context/auth.context';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    const { setUser } = useAuth()

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem("token");
            if (token) {
                clearInterval(interval);
                setChecking(false);
                localStorage.removeItem("token");
                handleGoogleUser(JSON.parse(token).value);
            }
        }, 1000);

    }, [checking]);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim());
        setEmailErrorMessage("");
    };

    const handleSubmit = () => {
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        setEmailErrorMessage(emailError);
        setPasswordErrorMessage(passwordError);
        if (!emailError && !passwordError) {
            handleRegistration();
        }
    };

    const handleRegistration = async () => {
        console.log("this is our request destination*******>", `${process.env.REACT_APP_API_BASE_URL}api/auth/signup`)
        try {
            const response = await axios.post(process.env.REACT_APP_API_BASE_URL+'api/auth/signup', {email, password})
            // const apiUrl = process.env.REACT_APP_API_BASE_URL + 'api/auth/signup';
            // console.log('Submitting registration to:', apiUrl);
            // 
            // const response = await fetch(process.env.REACT_APP_API_BASE_URL+'api/auth/signup', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email,
            //         password,
            //     }),
            // });
            //
            // console.log('Response Status:', response.status);

            // 

            // if (response) {
                const data = await response.data;
                setUser(response.data)

                console.log("++++++++> this is our axios repsonse", response)
                setLocalItemWithExpiry("user", JSON.stringify(data.user), 2);
                console.log("this is parsedUser----->", JSON.stringify(data.user))
                navigate(appRoute.clients.registerProcess);
            // } 
            
            // else if (response.data.error) {
  
            //     console.log("This is else data xxxxxx>", response )
            //     // const errorData = response;
            //     // const errorMessage = errorData.message || 'Registration failed. Please try again.';
            //     // switch (errorMessage) {
            //     //     case "User already exists":
            //     //         setEmailErrorMessage("User already exists");
            //     //         break;
            //     //     default:
            //     //         break;
            //     // }
            // }
        } catch (error: any) {
            console.error('Error during registraton:', error);

            const errorMessage = error.response.data.message || 'Registration failed. Please try again.';
            switch (errorMessage) {
                case "User already exists":
                    setEmailErrorMessage("User already exists");
                    break;
                default:
                    break;
            }
        }
    };

    const handleGoogleUser = async (token: string) => {
        try {
            const response = await fetch(serverURL()+'/api/auth/refresh', {
                method: 'GET',
                headers: { "Accept": "application/json", "Authorization":  "Bearer "+token || "" },
            });

            if (response.ok) {
                const data = await response.json();
                setLocalItemWithExpiry("user", JSON.stringify(parseUser(data)), 2);
                navigate(appRoute.clients.registerProcess);
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Registration failed. Please try again.';
                alert(errorMessage);
                cleanlocalStorage();
            }
        } catch (error) {
            console.error('Error during register:', error);
        }
    };

    const handleRedirectToLogin = () => {
        navigate(appRoute.clients.login);
    };

    const handleRegisterWithGoogle = () => {
        const popup = window.open(
            serverURL()+"/api/auth/google",
            "authPopup",
            "width=500,height=600"
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
                <S.LoginTitle>Get started by creating your account</S.LoginTitle>
                <S.Subtitle>Enter an e-mail and a password</S.Subtitle>
                <S.Form>
                    <S.FormGroup>
                        <S.Label>Email <span className="required">*</span></S.Label>
                        <S.Input
                            hasErrors={emailErrorMessage != ""}
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        {emailErrorMessage && emailErrorMessage != "" && <S.ErrorLabel>{emailErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.FormGroup>
                        <S.Label>Create a Password <span className="required">*</span></S.Label>
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
                        {passwordErrorMessage && passwordErrorMessage != "" && <S.ErrorLabel>{passwordErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.Button onClick = {() => handleSubmit()}>Create Account</S.Button>
                </S.Form>
                <S.Separator>&nbsp; Or sign up with &nbsp;</S.Separator>
                {/* <S.GoogleButton onClick={handleRegisterWithGoogle}>
                    <S.GoogleIcon src={GoogleLogoImage} alt="Google" />
                    Google
                </S.GoogleButton> */}
                <S.RegisterContainer>
                    <S.Label>Already have an account?</S.Label>
                    <S.LabelButton onClick={handleRedirectToLogin}>Log In</S.LabelButton>
                </S.RegisterContainer>
                <S.RegisterContainer>
                    <S.Label>By singing up, I agree to Encore’s</S.Label>
                    <S.LabelButton>Terms & Conditions</S.LabelButton>
                </S.RegisterContainer>
            </S.RightContainer>
        </S.Container>
    );
};

export default Register;