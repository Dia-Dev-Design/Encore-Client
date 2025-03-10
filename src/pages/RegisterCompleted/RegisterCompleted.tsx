import React from "react";
import * as S from './styles';
import LogoImage from 'assets/images/BigLogo.png';

const RequestCompleted: React.FC = () => {
    const handleBackToHome = () => {
        window.location.href = "https://www.startupencore.ai/";
    };

    return (
        <S.Container>
            <S.LeftContainer>
                <S.Image src={LogoImage} alt="Logo" />
            </S.LeftContainer>
            <S.RightContainer>
                <S.InfoContainer>
                    <S.Title>Your request is being processed</S.Title>
                    <S.Subtitle>
                        We're validating your information as well as awaiting to connect with
                        you and know a little bit more about how we can help you. We will let
                        you know once you can access the information you're awaiting.
                    </S.Subtitle>
                    <S.Subtitle>
                        Please check your email to see your registration and call schedule.
                    </S.Subtitle>
                    <S.Button onClick={handleBackToHome}>Back to Homepage</S.Button>
                </S.InfoContainer>
            </S.RightContainer>
        </S.Container>
        
    );
};

export default RequestCompleted;
