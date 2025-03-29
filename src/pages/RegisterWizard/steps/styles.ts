import styled from 'styled-components';
import { theme } from 'utils/cssConstants';
import mq from 'utils/layouts';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TitleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const RegisterTitle = styled.h2`
    font-family: ${theme.fonts.primary};
    font-size: 18px;
    font-weight: 500;
    line-height: 27px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    margin: 0px;
    color: ${theme.colors.text.normal};
`;

export const EmailRegistered = styled.h2`
    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.text.label};

    margin: 10px 0;

    ::span {
        color: ${theme.colors.text.normal};
    }
`;

export const Form = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

export const FormGroup = styled.div`
    width: 100%;
`;

export const DropdownFormGroup = styled.div`
    width: 100%;
    min-height: 115px;
`;

export const NarrowFormGroup = styled.div`
    width: auto;
`;

export const WideFormGroup = styled.div`
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
`;

export const FormRowGroup = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 8px;
    align-items: center;
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

export const BoldLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    font-family: ${theme.fonts.primary};
    font-size: 14px;
    font-weight: 500;
    line-height: 17.5px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.text.title};

    .required {
        color: ${theme.colors.error};
    }
`;

export const Input = styled.input<{hasErrors: boolean}>`
    width: 100%;
    padding: 16px;
    font-family: ${theme.fonts.primary};

    border: 1px solid ${(props) => (props.hasErrors ? theme.colors.error : theme.colors.border.regular)};
    border-radius: ${theme.borderRadius.medium};
    box-sizing: border-box;
    padding-right: 40px;

    &:focus {
        border-color: ${(props) => (props.hasErrors ? theme.colors.error : theme.colors.border.regular)};
        outline: none;
    }

    &::placeholer {
        font-size: 12px;
        font-weight: 500;
        line-height: 15px;
        text-align: left;
    }
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

export const DropdownContainer = styled.div`
    position: relative;
    width: 130px;
    ${mq.smDown} {
        width: 100px;
    }
`;

export const DropdownHeader = styled.div<{hasErrors: boolean}>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    border: 1px solid ${(props) => (props.hasErrors ? theme.colors.error : theme.colors.border.regular)};
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    width: 130px;
    border-radius: ${theme.borderRadius.medium};
    height: 58px;
    ${mq.smDown} {
        width: 100px;
        padding: 10px;
    }
`;

export const DropdownOption = styled.label`
    display: flex;
    width: 100%;
    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: ${theme.colors.text.label};

    .required {
        color: ${theme.colors.error};
    }
`;

export const SelectedFlag = styled.img`
    height: 18px;
    width: 18px;
    border-radius: 50%;
    margin-right: 8px;
    object-fit: cover;
`;

export const SelectArrow = styled.img<{flipped: boolean}>`
    height: 24px;
    width: 24px;
    ${({ flipped }) => flipped && `transform: rotate(180deg);`}
`;

export const DropdownList = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    z-index: 1000;
    width: 180px;
`;

export const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    padding: 8px 16px;
    cursor: pointer;
    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: ${theme.colors.text.label};
    user-select: none;

    &:hover {
        background-color: #f5f5f5;
    }
`;

export const ItemFlag = styled.img`
    height: 18px;
    width: 18px;
    border-radius: 50%;
    margin-right: 8px;
    object-fit: cover;
`;

export const NormalDropdown = styled.select<{hasErrors: boolean}>`
    width: 100%;
    height: 58px;
    
    padding: 8px 16px;
    border: 1px solid ${(props) => (props.hasErrors ? theme.colors.error : theme.colors.border.regular)};
    border-radius: 4px;
    background-color: ${theme.colors.background.white};
    appearance: none;

    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: ${theme.colors.text.label};
`;

export const NormalOption = styled.option`
    display: flex;
    align-items: center;
    padding: 8px;
    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: left;
    color: ${theme.colors.text.label};
`;

export const MultipleDropdownContainer = styled.div`
    position: relative;
    width: 100%;
    ${mq.smDown} {
        height: 30px;
    }
`;

export const MultipleDropdownHeader = styled.div<{hasErrors: boolean}>`
    background-color: ${theme.colors.background.white};
    padding: 10px;
    cursor: pointer;
    border: 1px solid ${(props) => (props.hasErrors ? theme.colors.error : theme.colors.border.regular)};
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.text.label};
    ${mq.smDown} {
        height: 50px;
    }
`;

export const MultipleDropdownList = styled.ul`
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    max-height: 355px;
    overflow-y: auto;
    z-index: 1000;
    list-style: none;
    margin: 0;
    padding: 0;
`;

export const MultipleDropdownItem = styled.li`

    &:hover {
        background-color: #f0f0f0;
    }
`;

export const MultipleDropdownLabel = styled.label`
    user-select: none;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    font-family: ${theme.fonts.primary};
    font-size: 16px;
    font-weight: 500;
    line-height: 15px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: ${theme.colors.text.label};
`;

export const MultipleCheckbox = styled.input`
    margin-left: 10px;
`;

export const MultipleSelectedItems = styled.div`
    font-size: 14px;
    margin-top: 8px;
`;

export const RadioGroupContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0;
    gap: 16px;
`;

export const VerticalRadioGroupContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    gap: 16px;
`;

export const RadioOption = styled.label`
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    gap: 8px;
`;

export const RadioButton = styled.input`
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid ${theme.colors.primaryButton};
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

    &:checked::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        background-color: ${theme.colors.primaryButton};
        border-radius: 50%;
        transform: translate(-50%, -50%);
    }

    &:hover {
        border-color: ${theme.colors.primaryButton};
    }
`;

export const TooltipWrapper = styled.div`
    position: relative;
    display: inline-block;
    cursor: pointer;
`;

export const TooltipText = styled.div`
    visibility: hidden;
    opacity: 0;
    width: 300px;
    background-color: ${theme.colors.background.white};
    color: #000;
    text-align: left;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    font-weight: 500;

    position: absolute;
    bottom: 130%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    transition: opacity 0.3s ease-in-out;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 10px;
        border-style: solid;
        border-color: #fff transparent transparent transparent;
    }

    ${TooltipWrapper}:hover & {
        visibility: visible;
        opacity: 1;
    }
`;

export const TooltipIcon = styled.span`
    font-size: 16px;
    margin-left: 8px;
    display: inline-flex;
    align-items: center;
`;
