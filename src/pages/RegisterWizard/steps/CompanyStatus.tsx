import React, { useEffect, useState } from "react";
import * as S from './styles';
import { CompanyStatusData } from "utils/interfaces";
import { getLocalItem } from "helper/localStorage.helper";

interface CompanyStatusProps {
    companyStatusData: CompanyStatusData;
    setCompanyStatusData: (data: CompanyStatusData) => void;
    companyStatusErrors: string[];
}

const CompanyStatus: React.FC<CompanyStatusProps> = ({ companyStatusData, setCompanyStatusData, companyStatusErrors }) => {
    const currentStageOptions = [
        {"id":"RECENTLY_DECIDED_SHUTDOWN", "label":"Recently decided to shut down"},
        {"id":"MIDDLE_OF_SHUTDOWN", "label":"Middle of the shutdown process"}, 
        {"id":"PARTIAL_UNWIND", "label":"Content/Partial Unwind / Downsize"}, 
        {"id":"DISTRESSED_SALE", "label":"Distressed Sale"}, 
        {"id":"UNDECIDED", "label":"Haven’t decided yet"}, 
        {"id":"OTHER", "label":"Other"}, 
    ];
    const [selectedCurrentStageOption, setSelectedCurrentStageOption] = useState<string>("");
    const [otherCurrentStageOption, setOtherCurrentStageOption] = useState<string>("");
    const [otherCurrentStageErrorMessage, setOtherCurrentStageErrorMessage] = useState<string>("");

    useEffect(() => {
        const jsonUser = getLocalItem("user");
        const jsonCompany = getLocalItem("company");
        if (jsonUser){

            const tempUser = JSON.parse(jsonUser)
            if (jsonCompany){
                const tempCompany = JSON.parse(jsonCompany)
                getStep3Data(tempUser.accessToken, tempCompany.id);
            } else {
                console.log("Error getting company");
            }
        } else {
            console.log("Error getting user");
        }
    }, []);
    
    useEffect(() => {
        const errorMessages: { [key: string]: (message: string) => void } = {
            currentStage: setOtherCurrentStageErrorMessage,
        };
    
        Object.entries(errorMessages).forEach(([field, setErrorMessage]) => {
            if (companyStatusErrors.includes(field)) {
                switch (field) {
                    case "currentStage":
                        setErrorMessage("Enter your current stage");
                        break;
                    default:
                        setErrorMessage("");
                }
            } else {
                setErrorMessage("");
            }
        });
    }, [companyStatusErrors]);

    const getStep3Data = async (accessToken: string, companyId: string): Promise<boolean> => {
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL+"api/register/step3/"+companyId, {
                method: "GET", 
                headers: { "Accept": "application/json", "Authorization":  "Bearer "+accessToken || "" },
            });

            if (!response.ok) {
                throw new Error("Error gathering data");
            }
            const dataReceived: CompanyStatusData = await response.json();
            setCompanyStatusData(dataReceived);
            if (dataReceived.currentStage !== currentStageOptions[0].id && dataReceived.currentStage !== currentStageOptions[1].id &&
                dataReceived.currentStage !== currentStageOptions[2].id && dataReceived.currentStage !== currentStageOptions[3].id && 
                dataReceived.currentStage !== currentStageOptions[4].id
            ){
                setSelectedCurrentStageOption(currentStageOptions[5].id);
                setOtherCurrentStageOption(dataReceived.currentStage);
            } else {
                setSelectedCurrentStageOption(dataReceived.currentStage);
            }
            return true;
        } catch (error) {
            console.error("Failed to gather data:", error);
            return false;
        }
    };

    const handleStageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCurrentStageOption(e.target.value);
        if (e.target.value === currentStageOptions[currentStageOptions.length-1].id){
            if (otherCurrentStageOption !== ""){
                setOtherCurrentStageErrorMessage("");
                setCompanyStatusData({ ...companyStatusData, currentStage: otherCurrentStageOption });
            } else {
                setOtherCurrentStageErrorMessage("Enter your current stage");
            }
            
        } else {
            setCompanyStatusData({ ...companyStatusData, currentStage: e.target.value });
        }
    };

    const handleOtherStageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherCurrentStageOption(e.target.value);
        if (selectedCurrentStageOption === currentStageOptions[currentStageOptions.length-1].id){
            if (e.target.value !== ""){
                setOtherCurrentStageErrorMessage("");
                setCompanyStatusData({ ...companyStatusData, currentStage: e.target.value });
            } else {
                setOtherCurrentStageErrorMessage("Enter your current stage");
            }
        } else {
            setOtherCurrentStageOption("");
        }
    };

    return (
        <S.Form>
            <S.FormGroup>
                <S.BoldLabel>Could you please indicate your current stage in the process?</S.BoldLabel>
                <S.VerticalRadioGroupContainer>
                    {currentStageOptions.map((option, index) => (
                        <S.RadioOption key={index}>
                            <S.RadioButton
                                type="radio"
                                name="radioGroup"
                                value={option.id}
                                checked={selectedCurrentStageOption === option.id}
                                onChange={handleStageChange}
                            />
                            {option.label}
                        </S.RadioOption>
                    ))}
                </S.VerticalRadioGroupContainer>
            </S.FormGroup>
            {selectedCurrentStageOption === currentStageOptions[currentStageOptions.length - 1].id && (
                <S.FormGroup>
                    <S.Label>Other <span className="required">*</span></S.Label>
                    <S.Input
                        hasErrors={otherCurrentStageErrorMessage != ""} 
                        type="text" 
                        id="name" 
                        value={otherCurrentStageOption} 
                        placeholder="Enter your current stage"
                        onChange={handleOtherStageChange} 
                    />
                    {otherCurrentStageErrorMessage && otherCurrentStageErrorMessage != "" && <S.ErrorLabel>{otherCurrentStageErrorMessage}</S.ErrorLabel>}
                </S.FormGroup>
                )}
        </S.Form>
    );
};

export default CompanyStatus;
