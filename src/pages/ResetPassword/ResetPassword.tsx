import React, { useState, ChangeEvent, useEffect } from 'react';
import { validatePassword } from "utils/userValidations";
import LogoImage from 'assets/images/BigLogo.png';
import ShowPasswordIcon from 'assets/icons/StatusOn.svg';
import HidePasswordIcon from 'assets/icons/StatusOff.svg';
import * as S from './styles';
import { useNavigate } from 'react-router-dom';
import { serverURL } from 'utils/constants';
import { appRoute } from 'consts/routes.const';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatedPassword, setShowRepeatedPassword] = useState(false);
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("");
    const [repeatedPasswordErrorMessage, setRepeatedPasswordErrorMessage] = useState("");

    useEffect(() => {
        const handleToken = () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (token) {
                setToken(token);
            } else {
                alert("The token was not found in the URL.");
            }
        };

        handleToken();
    }, []);

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value.trim());
        setNewPasswordErrorMessage("");
    };

    const handleNewPasswordBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordErrorMessage(validatePassword(e.target.value.trim()));
    };

    const handleRepeatedPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatedPassword(e.target.value.trim());
        setRepeatedPasswordErrorMessage("");
    };

    const handleRepeatedPasswordBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatedPasswordErrorMessage(validatePassword(e.target.value.trim()));
        if (e.target.value.trim() !== newPassword) {
            setRepeatedPasswordErrorMessage("Both passwords must match");
        }
    };

    const handleSubmit = () => {
        const emailError = validatePassword(newPassword);

        setNewPasswordErrorMessage(emailError);
        if (!emailError) {
            handleReset();
        }
    };

    const handleReset = async () => {
        try {
            const response = await fetch(serverURL()+'/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword,
                }),
            });

            if (!response.ok) {                    
                console.error('Error changing password.');
            }
            alert("Your password has been updated");
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
                <S.LoginTitle>Create a new password</S.LoginTitle>
                <S.Subtitle>Your password must be different from previous used passwords.</S.Subtitle>
                <S.Form>
                    <S.FormGroup>
                        <S.Label>New Password <span className="required">*</span></S.Label>
                        <S.PasswordContainer>
                            <S.Input
                                hasErrors={newPasswordErrorMessage != ""} 
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                value={newPassword}
                                placeholder='Enter new password'
                                onChange={handleNewPasswordChange}
                                onBlur={handleNewPasswordBlur}
                            />
                            <S.ToggleIcon src={showNewPassword ? HidePasswordIcon : ShowPasswordIcon} onClick={() => setShowNewPassword(!showNewPassword)}/>
                        </S.PasswordContainer>
                        {newPasswordErrorMessage && newPasswordErrorMessage != "" && <S.ErrorLabel>{newPasswordErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.FormGroup>
                        <S.Label>Confirm Password <span className="required">*</span></S.Label>
                        <S.PasswordContainer>
                            <S.Input
                                hasErrors={repeatedPasswordErrorMessage != ""} 
                                type={showRepeatedPassword ? "text" : "password"}
                                id="repeatedPassword"
                                value={repeatedPassword}
                                placeholder='Confirm new password'
                                onChange={handleRepeatedPasswordChange}
                                onBlur={handleRepeatedPasswordBlur}
                            />
                            <S.ToggleIcon src={showRepeatedPassword ? HidePasswordIcon : ShowPasswordIcon} onClick={() => setShowRepeatedPassword(!showRepeatedPassword)}/>
                        </S.PasswordContainer>
                        {repeatedPasswordErrorMessage && repeatedPasswordErrorMessage != "" && <S.ErrorLabel>{repeatedPasswordErrorMessage}</S.ErrorLabel>}
                    </S.FormGroup>
                    <S.Button onClick = {() => handleSubmit()}>Reset password</S.Button>
                </S.Form>
            </S.RightContainer>
        </S.Container>
    );
};

export default ResetPassword;