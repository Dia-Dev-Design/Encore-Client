import styled from 'styled-components';
import { theme } from 'utils/cssConstants';
import mq from 'utils/layouts';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    min-height: 100vh;
    width: 100%;
`;

export const LeftContainer = styled.div`
    width: 40vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${theme.colors.background.standard};
    box-shadow: 0px 0px 24px 0px ${theme.colors.shadow};
    ${mq.smDown} {
        display: none;
    }
`;

export const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`;

export const RightContainer = styled.div`
    min-width: 30vw;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 40px 60px;
    box-shadow: 0px 0px 24px 0px ${theme.colors.shadow};
    text-align: left;
    font-family: ${theme.fonts.primary};
    border-radius: ${theme.borderRadius.medium}
`;

export const LoginTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
`;

export const Subtitle = styled.p`
    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    color: ${theme.colors.text.normal};
    margin-bottom: 30px;
`;

export const Form = styled.div`
    width: 100%;
`;

export const FormGroup = styled.div`
    margin: 0 auto 20px;
    width: 100%;
`;

export const PasswordContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
`;

export const ToggleIcon = styled.img`
    position: absolute;
    right: 10px;
    cursor: pointer;
    width: 24px;
    height: 24px;
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 5px;
    font-family: ${theme.fonts.primary};
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.text.label};

    .required {
        color: ${theme.colors.error};
    }
`;

export const Input = styled.input<{hasErrors: boolean}>`
    width: 100%;
    padding: 16px;
    border: 1px solid ${({ hasErrors }) => hasErrors ? theme.colors.error : theme.colors.border.regular};
    border-radius: ${theme.borderRadius.medium};
    box-sizing: border-box;
    padding-right: 40px;
`;

export const ErrorLabel = styled.label`
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    font-family: ${theme.fonts.primary};
    font-size: 12px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.error};
`;

export const RememberSection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
`;

export const RememberMe = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
`;

export const Checkbox = styled.input`
    margin-right: 5px;
`;

export const ForgotPassword = styled.a`
    color: #333;
    text-decoration: none;
    display: block;
    text-align: right;
`;

export const Button = styled.button`
    background-color: ${theme.colors.primaryButton};
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: ${theme.borderRadius.medium};
    cursor: pointer;
    width: 100%;
    height: 48px;

    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
`;

export const Separator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: center;
    color: ${theme.colors.text.label};

    &::before,
    &::after {
        content: "";
        flex: 1;
        height: 1px;
        background-color: ${theme.colors.border.separator};
    }
`;


export const GoogleButton = styled.button`
    background-color: ${theme.colors.background.white};
    color: ${theme.colors.google.text};
    border: 1px solid ${theme.colors.border.regular};
    border-radius: ${theme.borderRadius.medium};
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 100%;
    height: 48px;

    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    &:hover {
        background-color: ${theme.colors.google.backgroundHover};
    }
`;

export const GoogleIcon = styled.img`
    width: 20px;
    margin-right: 10px;
`;

export const RegisterContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
`;

export const LabelButton = styled.button`
    background-color: ${theme.colors.background.white};
    color: ${theme.colors.text.link};
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 5px;

    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 600;
    line-height: 17.5px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
`;

