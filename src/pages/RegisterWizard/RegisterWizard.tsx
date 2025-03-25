import React, { useEffect, useState } from "react";
import * as S from './styles';
import LogoImage from 'assets/images/BigLogo.png';
import BasicInfo from "./steps/BasicInfo";
import CompanyDetails from "./steps/CompanyDetails";
import CompanyStatus from "./steps/CompanyStatus";
import CallSchedule from "./steps/CallSchedule";
import { BasicInfoData, CallScheduleData, Company, CompanyDetailsData, CompanyStatusData, User } from "utils/interfaces";
import { parseCompany } from "utils/functions";
import { useNavigate } from "react-router-dom";
import { getLocalItem, setLocalItemWithExpiry } from "helper/localStorage.helper";
import { appRoute } from "consts/routes.const";
import { useAuth } from "context/auth.context";

import { RegularUser } from "context/auth.context";


const RegisterWizard: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const steps = ["Basic Info", "Company Details", "Company Status", "Call Schedule"];
    const [userData, setUserData] = useState<User>();
    const [companyData, setCompanyData] = useState<Company>();
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [basicInfoData, setBasicInfoData] = useState<BasicInfoData>({
        fullname: "",
        phone: "",
        companyName: "",
        industryId: "",
        otherCountries: null,
        states: [""],
    });
    const [companyDetailsData, setCompanyDetailsData] = useState<CompanyDetailsData>({
        structure: "",
        hasRaisedCapital: true,
        hasW2Employees: true,
        employeesStates: null,
        employeesCountries: null
    });
    const [companyStatusData, setCompanyStatusData] = useState<CompanyStatusData>({
        currentStage: ""
    });
    const [callScheduleData, setCallScheduleData] = useState<CallScheduleData>({ 
        channelPreference: "",
        date: new Date(),
        callScheduled: false
    });
    const [basicInfoErrors, setBasicInfoErrors] = useState<string[]>([]);
    const [companyDetailsErrors, setCompanyDetailsErrors] = useState<string[]>([]);
    const [companyStatusErrors, setCompanyStatusErrors] = useState<string[]>([]);
    const [callScheduleErrors, setCallScheduleErrors] = useState<string[]>([]);
    const [visibleConfirm, setVisibleConfirm] = useState<boolean>(true);

    const endpoints = {
        basicInfo: "api/register/step1",
        companyDetails: "api/register/step2/",
        companyStatus: "api/register/step3/",
    };

    useEffect(() => {
        // const jsonUser = getLocalItem("user");
        if (user){
            setUserData(user as unknown as User)
        } else {
            alert("There is no active registration process");
            navigate(appRoute.clients.register);
        }
    }, []);

    const saveStepData = async (endpoint: string, data: any, currentStep: number): Promise<boolean> => {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization":  "Bearer "+userData?.accessToken || "" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Login failed. Please try again.';
                handleErrors(JSON.stringify(errorMessage));
                return false;
            }
            const dataReceived = await response.json();

            if (currentStep === 0){
                setLocalItemWithExpiry("company", JSON.stringify(parseCompany(dataReceived)), 2);
                setCompanyData(parseCompany(dataReceived));
            }

            return true;
        } catch (error) {
            console.error(`Failed to save step data at ${currentStep}:`, error);
            alert(`Failed to save data`);
            return false;
        }
    };

    const handleErrors = (errorMessage: string) => {
        switch (currentStep) {
            case 0:
                let basicInfoErrors = [""];
                if (errorMessage.includes("fullname should not be empty") || errorMessage.includes("fullname must be a string")) {
                    basicInfoErrors.push("fullname");
                }
                if (errorMessage.includes("phone should not be empty") || errorMessage.includes("phone must be a valid phone number")) {
                    basicInfoErrors.push("phone");
                }
                if (errorMessage.includes("states should not be empty")) {
                    basicInfoErrors.push("states");
                }
                setBasicInfoErrors(basicInfoErrors);
                break;
            
        }
    }

    const goNext = async () => {
        if (!validateStepData()) {
            alert("Please fill in all required fields correctly.");
            return;
        }

        let endpoint = "";
        let data = {};

        if (currentStep === 3){
            navigate(appRoute.clients.registered);
        } else {
            switch (currentStep) {
                case 0:
                    endpoint = endpoints.basicInfo;
                    data = basicInfoData || {};
                    break;
                case 1:
                    endpoint = endpoints.companyDetails;
                    data = companyDetailsData || {};
                    break;
                case 2:
                    endpoint = endpoints.companyStatus;
                    data = companyStatusData || {};
                    break;
                default:
                    return;
            }
    
            //console.log( `Step ${currentStep} data`, data);
    
            let updatedEndpoint = "";
            
            if(currentStep > 0){
                updatedEndpoint = process.env.REACT_APP_API_BASE_URL + endpoint + companyData?.id;
            } else {
                updatedEndpoint = process.env.REACT_APP_API_BASE_URL + endpoint;
            }
    
            const isSaved = await saveStepData(updatedEndpoint, data, currentStep);
            if (isSaved) {
                setCompletedSteps([...completedSteps, currentStep]);
                setCurrentStep((prev) => prev + 1);
            }
        }
    };
    
    const validateBasicInfo = (): boolean => {
        const fieldsToValidate = [
            { field: "fullname", value: basicInfoData.fullname },
            { field: "phone", value: basicInfoData.phone },
            { field: "companyName", value: basicInfoData.companyName },
            { field: "industryId", value: basicInfoData.industryId },
            { field: "otherCountries", value: basicInfoData.otherCountries },
            { field: "states", value: basicInfoData.states },
        ];
    
        let isValid = true;
        const errors: string[] = [];
    
        fieldsToValidate.forEach(({ field, value }) => {
            if (value === "") {
                errors.push(field);
                isValid = false;
            }
        });
    
        setBasicInfoErrors(errors);
    
        return isValid;
    }
    const validateStepData = (): boolean => {
        switch (currentStep) {
            case 0:
                return validateBasicInfo();
            case 1:
                return validateCompanyDetails();
            case 2:
                return validateCompanyStatus();
            case 3:
                return validateCallSchedule();
            default:
                return false;
        }
    };

    const goBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };


    const validateCompanyDetails = (): boolean => {
        const errors: string[] = [];
    
        if (companyDetailsData.structure === ""){
            errors.push("structure");
        }
        if (companyDetailsData.hasW2Employees && (!companyDetailsData.employeesStates || companyDetailsData.employeesStates.length === 0)) {
            errors.push("employeesStates");
        }
        if (errors.length > 0) {
            setCompanyDetailsErrors(errors);
            return false;
        } else {
            setCompanyDetailsErrors([]);
            return true;
        }
    }

    const validateCompanyStatus = (): boolean => {
        const errors: string[] = [];
    
        if (companyStatusData?.currentStage === ""){
            errors.push("currentStage");
        }
        if (errors.length > 0) {
            setCompanyStatusErrors(errors);
            return false;
        } else {
            setCompanyStatusErrors([]);
            return true;
        }
        
    }

    const validateCallSchedule = (): boolean => {
        const errors: string[] = [];
    
        if (!callScheduleData?.callScheduled){
            errors.push("callScheduled");
        }
        if (errors.length > 0) {
            setCallScheduleErrors(errors);
            return false;
        } else {
            setCallScheduleErrors([]);
            return true;
        }
        
    }

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <BasicInfo 
                            basicInfoData={basicInfoData}
                            setBasicInfoData={setBasicInfoData}
                            basicInfoErrors={basicInfoErrors}
                        />;
            case 1:
                return <CompanyDetails
                            companyDetailsData={companyDetailsData}
                            setCompanyDetailsData={setCompanyDetailsData} 
                            companyDetailsErrors={companyDetailsErrors}
                        />;
            case 2:
                return <CompanyStatus 
                            companyStatusData={companyStatusData}            
                            setCompanyStatusData={setCompanyStatusData} 
                            companyStatusErrors={companyStatusErrors}
                        />;
            case 3:
                return <CallSchedule
                            callScheduleData={callScheduleData}
                            setCallScheduleData={setCallScheduleData} 
                            callScheduleErrors={callScheduleErrors}
                            setVisibleConfirm={setVisibleConfirm}
                            completedSteps={completedSteps}
                            setCompletedSteps={setCompletedSteps}
                        />;
            default:
                return null;
        }
    };

    return (
        <S.Container>
            <S.LeftContainer>
                <S.Image src={LogoImage} alt="Logo" />
            </S.LeftContainer>
            <S.RightContainer>
                <S.Stepper>
                    {steps.map((step, index) => {
                        const isCompleted = completedSteps?.includes(index) ? completedSteps?.includes(index) : false;

                        return (
                            <React.Fragment key={index}>
                                <S.Step active={index === currentStep} completed={isCompleted}>
                                    <S.StepCircle active={index === currentStep} completed={isCompleted}>
                                        {index + 1}
                                    </S.StepCircle>
                                    {isCompleted && <S.CheckIcon /> }
                                    <S.StepLabel active={index === currentStep} completed={isCompleted}>
                                        {step}
                                    </S.StepLabel>
                                </S.Step>
                                {index < steps.length - 1 && <S.Separator />}
                            </React.Fragment>
                        );
                    })}
                </S.Stepper>

                <S.StepContent>{renderStep()}</S.StepContent>

                <S.Buttons>
                    {currentStep > 0 && <S.BaseButton onClick={goBack}>Back</S.BaseButton>}
                    {visibleConfirm && (
                        <S.NextButton onClick={goNext}>{currentStep === steps.length - 1 ? "Confirm" : "Next"}</S.NextButton>
                    )}
                </S.Buttons>
            </S.RightContainer>
        </S.Container>
    );
};

export default RegisterWizard;
