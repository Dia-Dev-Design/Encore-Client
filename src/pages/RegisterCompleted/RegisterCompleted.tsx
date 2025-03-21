import React, { useEffect } from "react";
import * as S from './styles';
import LogoImage from 'assets/images/BigLogo.png';
import { useNavigate } from "react-router-dom";
import { appRoute } from "consts/routes.const";

interface RegisterCompletedProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const RegisterCompleted: React.FC<RegisterCompletedProps> = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        
        const redirectTimer = setTimeout(() => {
            navigate(appRoute.clients.dashboard);
        }, 3000); 
        
        return () => clearTimeout(redirectTimer);
    }, [navigate, setIsLoggedIn]);
    
    return (
        <S.Container>
            <S.LeftContainer>
                <S.Image src={LogoImage} alt="Logo" />
            </S.LeftContainer>
            <S.RightContainer>
                <S.InfoContainer>
                    <S.Title>Registration Completed</S.Title>
                    <S.Subtitle>
                        We're validating your information as well as awaiting to connect with
                        you and know a little bit more about how we can help you.
                    </S.Subtitle>
                    <S.Subtitle>
                        Please check your email to see your registration and call schedule.
                    </S.Subtitle>
                    <S.Subtitle>
                        You will be redirected to your dashboard in a few seconds...
                    </S.Subtitle>
                </S.InfoContainer>
            </S.RightContainer>
        </S.Container>
    );
};

export default RegisterCompleted;