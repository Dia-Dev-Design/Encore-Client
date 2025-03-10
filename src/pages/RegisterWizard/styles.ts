import styled from 'styled-components';
import { theme } from 'utils/cssConstants';
import mq from 'utils/layouts';

const paddingHorizontal = '20%';
const stepperHeight = '140px';
const buttonsHeight = '80px';

export const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    min-height: 100vh;
`;

export const LeftContainer = styled.div`
    width: 40vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${theme.colors.background.standard};
    box-shadow: 0px 0px 24px 0px ${theme.colors.shadow};
    overflow: hidden;
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
    margin: 0 auto;
    padding: ${stepperHeight} ${paddingHorizontal} ${buttonsHeight} ${paddingHorizontal};
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;

    text-align: left;
    font-family: ${theme.fonts.primary};
    border-radius: ${theme.borderRadius.medium};
    
    ${mq.smDown} {
        padding: ${stepperHeight} 10px ${buttonsHeight} 10px;
    }
`;

export const TitleWizard = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
`;

export const SubtitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TitleDescription = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
`;

export const SubtitleDescription = styled.p`
    font-family: Figtree;
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    color: #666;
    margin-bottom: 30px;
`;

export const Stepper = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    padding-top: 40px;
    justify-content: space-between;
    margin-bottom: 20px;
    background-color: ${theme.colors.background.white};
    height: ${stepperHeight};
    align-self: center;
    z-index: 1001;
    width: 100%;
    max-width: 400px;
`;

export const Step = styled.div<{ active: boolean; completed: boolean }>`
    position: relative;    
    text-align: center;
    flex: 1;
`;

export const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-family: ${theme.fonts.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    ${({ completed, active }) => {
        if (completed) {
            return `
                background-color: ${theme.colors.confirmButton};
                color: ${theme.colors.text.white};
            `;
        } else if (active) {
            return `
                background-color: ${theme.colors.primaryButton};
                color: ${theme.colors.text.white};
            `;
        } else {
            return `
                background-color: ${theme.colors.text.lightGray};
                color: ${theme.colors.text.darkGray};
            `;
        }
    }}
`;

export const StepLabel = styled.div<{ active: boolean; completed: boolean }>`
    margin-top: 8px;
    font-family: ${theme.fonts.primary};
    font-size: 12px;
    ${({ completed, active }) => {
        if (completed) {
            return `
                color: ${theme.colors.confirmButton};
            `;
        } else if (active) {
            return `
                color: ${theme.colors.primaryButton};
            `;
        } else {
            return `
                color: ${theme.colors.text.darkGray};
            `;
        }
    }}
`;

export const CheckIcon = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    color: ${theme.colors.confirmButton};
    font-size: 15px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;

    &:after {
        content: "✔";
    }
`;

export const StepContent = styled.div`
    margin-bottom: 10px;
    width: 100%;
`;

export const Buttons = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    position: fixed;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    padding: 10px 0 20px 0;
    height: ${buttonsHeight};
    background-color: ${theme.colors.background.white};
    align-self: center;

    ${mq.smDown} {
        background-color: transparent;
    }
`;

export const BaseButton = styled.button`
    background-color: ${theme.colors.background.white};
    padding: 10px 20px;
    cursor: pointer;
    border-radius: ${theme.borderRadius.medium};
    width: 100%;
    height: 48px;
    border: 1px solid ${theme.colors.border.regular};

    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    color: ${theme.colors.text.label};

    &:hover {
        background-color: #bbb;
    }
`;

export const BackButton = styled(BaseButton)`
    background-color: ${theme.colors.background.white};
    border: 1px solid ${theme.colors.border.regular};
    color: ${theme.colors.text.label};

    &:hover {
        background-color: #bbb;
    }
`;

export const NextButton = styled(BaseButton)`
    background-color: ${theme.colors.primaryButton};
    border: none;
    color: ${theme.colors.text.white};

    &:hover {
        background-color: #0056b3;
    }
`;

export const ConfirmButton = styled(BaseButton)`
    background-color: ${theme.colors.confirmButton};
    border: none;
    color: ${theme.colors.text.white};

    &:hover {
        background-color: #218838;
    }
`;

export const Separator = styled.div`
    width: 50px;
    height: 1px;
    background-color: #D4D9DD;
    margin: auto;
`;