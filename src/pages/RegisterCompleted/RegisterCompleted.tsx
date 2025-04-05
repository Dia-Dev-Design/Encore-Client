import React from "react";
import * as S from "./styles";
import LogoImage from "assets/images/BigLogo.png";

const RegisterCompleted: React.FC = () => {
  return (
    <S.Container>
      <S.LeftContainer>
        <S.Image src={LogoImage} alt="Logo" />
      </S.LeftContainer>
      <S.RightContainer>
        <S.InfoContainer>
          <S.Title>Thank You for Signing Up!</S.Title>
          <S.Subtitle>
            Your registration has been received successfully.
          </S.Subtitle>
          <S.Subtitle>
            You will gain access to the Encore platform once your intake call is
            complete.
          </S.Subtitle>
          <S.Subtitle>
            Please check your email for details about your scheduled call.
          </S.Subtitle>
        </S.InfoContainer>
      </S.RightContainer>
    </S.Container>
  );
};

export default RegisterCompleted;
