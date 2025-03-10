import React, { useState, ChangeEvent, useEffect } from 'react';
import { validateEmail, validatePassword } from "utils/userValidations";
import LogoImage from 'assets/images/BigLogo.png';
import * as S from './styles';
import { useNavigate } from 'react-router-dom';
import { serverURL } from 'utils/constants';
import { appRoute } from 'consts/routes.const';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const handleSubmit = () => {
        const emailError = validateEmail(email);

        setEmailErrorMessage(emailError);
        if (!emailError) {
            handleReset();
        }
    };

    const handleReset = async () => {
        try {
            const response = await fetch(serverURL()+'/api/auth/request-password-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                }),
            });

            if (!response.ok) {                    
                console.error('Login failed. Please check your credentials.');
            }
            alert("Password restore email sent");
            navigate(appRoute.clients.login);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <S.Container>
            <S.LeftContainer>
                <S.Image src={LogoImage} alt="Logo" />
            </S.LeftContainer>
            <S.RightContainer>
                <S.LoginTitle>Reset your password</S.LoginTitle>
                <S.Subtitle>Enter the email associated with your account and we’ll send you a link to reset your password</S.Subtitle>
                <S.Form>
                    <S.FormGroup>
                        <S.Label htmlFor="email">Email <span className="required">*</span></S.Label>
                        <S.Input
                            hasErrors={emailErrorMessage != ""} 
                            type="email" 
                            id="email" 
                            value={email} 
                            placeholder='Enter your email address'
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {emailErrorMessage && emailErrorMessage != "" && <S.ErrorLabel htmlFor="email">{emailErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.Button onClick = {() => handleSubmit()}>Send link to email</S.Button>
                </S.Form>
            </S.RightContainer>
        </S.Container>
    );
};

export default ForgotPassword;