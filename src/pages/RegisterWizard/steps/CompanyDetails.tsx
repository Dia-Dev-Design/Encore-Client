import React, { useEffect, useRef, useState } from "react";
import * as S from './styles';
import arrow from 'assets/icons/Arrow.png';
import { countries, states } from "utils/constants";
import { CompanyDetailsData, User } from "utils/interfaces";
import { getLocalItem } from "helper/localStorage.helper";

interface CompanyDetailsProps {
    companyDetailsData: CompanyDetailsData;
    setCompanyDetailsData: (data: CompanyDetailsData) => void;
    companyDetailsErrors: string[];
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({companyDetailsData, setCompanyDetailsData, companyDetailsErrors }) => {
    const structureOptions = [
        { label:"Corporation", value: "CORPORATION"},
        { label:"LLC", value: "LLC"},
        { label:"Other", value: "Other"},
    ];
    const raiseOptions = ["Yes", "No"];
    const employeeOptions = ["Yes", "No"];

    const companyDetailsStateRef = useRef<HTMLDivElement>(null);
    const companyDetailsCountryRef = useRef<HTMLDivElement>(null);
    
    const [selectedStructureOption, setSelectedStructureOption] = useState<string>("");
    const [otherStructureOption, setOtherStructureOption] = useState<string>("");
    const [selectedRaiseOption, setSelectedRaiseOption] = useState<string>("");
    const [selectedEmployeeOption, setSelectedEmployeeOption] = useState<string>("");
    const [isCompanyStatesOpen, setIsCompanyStatesOpen] = useState(false);
    const [selectedCompanyStatesOptions, setSelectedCompanyStatesOptions] = useState<string[]>([]);
    const [companyStateErrorMessage, setCompanyStateErrorMessage] = useState<string>("");

    const [selectedCompanyCountriesOptions, setSelectedCompanyCountriesOptions] = useState<string[]>([]);
    const [isCompanyCountriesOpen, setIsCompanyCountriesOpen] = useState<boolean>(false);

    const toggleCompanyStatesDropdown = () => setIsCompanyStatesOpen(!isCompanyStatesOpen);
    const toggleCompanyCountriesDropdown = () => setIsCompanyCountriesOpen(!isCompanyCountriesOpen);
    
    const [otherStructureErrorMessage, setOtherStructureErrorMessage] = useState<string>("");

    useEffect(() => {
        const jsonUser = getLocalItem("user");
        const jsonCompany = getLocalItem("company");
        if (jsonUser){

            const tempUser = JSON.parse(jsonUser)
            if (jsonCompany){
                const tempCompany = JSON.parse(jsonCompany)
                getStep2Data(tempUser.accessToken, tempCompany.id);
            } else {
                console.log("Error getting company");
            }
        } else {
            console.log("Error getting user");
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const getStep2Data = async (accessToken: string, companyId: string): Promise<boolean> => {
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL+"api/register/step2/"+companyId, {
                method: "GET", 
                headers: { "Accept": "application/json", "Authorization":  "Bearer "+accessToken || "" },
            });

            if (!response.ok) {
                throw new Error("Error gathering data");
            }
            const dataReceived: CompanyDetailsData = await response.json();
            setCompanyDetailsData(dataReceived);
            if (dataReceived.structure !== structureOptions[0].value && dataReceived.structure !== structureOptions[1].value){
                setSelectedStructureOption(structureOptions[2].value);
                setOtherStructureOption(dataReceived.structure);
            } else {
                setSelectedStructureOption(dataReceived.structure);
            }
            setSelectedRaiseOption(dataReceived.hasRaisedCapital ? raiseOptions[0] : raiseOptions[1]);
            setSelectedEmployeeOption(dataReceived.hasRaisedCapital ? employeeOptions[0] : employeeOptions[1]);
            if (dataReceived.employeesStates)
            {
                setSelectedCompanyStatesOptions(dataReceived.employeesStates);
            }
            if (dataReceived.employeesCountries)
            {
                setSelectedCompanyCountriesOptions(dataReceived.employeesCountries);
            }
            return true;
        } catch (error) {
            console.error("Failed to gather data:", error);
            return false;
        }
    };

    useEffect(() => {
        const errorMessages: { [key: string]: (message: string) => void } = {
            structure: setOtherStructureErrorMessage,
            employeesStates: setCompanyStateErrorMessage
        };
    
        Object.entries(errorMessages).forEach(([field, setErrorMessage]) => {
            if (companyDetailsErrors.includes(field)) {
                switch (field) {
                    case "structure":
                        setErrorMessage("Enter your company structure");
                        break;
                    case "employeesStates":
                        setErrorMessage("Select at least one State");
                        break;
                    default:
                        setErrorMessage("");
                }
            } else {
                setErrorMessage("");
            }
        });
    }, [companyDetailsErrors]);
    
    const handleCompanyStatesOptionChange = (option: string) => {
        setSelectedCompanyStatesOptions((prevSelected) => {
            const updatedSelection = prevSelected.includes(option)
                ? prevSelected.filter((item) => item !== option)
                : [...prevSelected, option];
    
                setCompanyDetailsData({ ...companyDetailsData, employeesStates: updatedSelection });
    
            return updatedSelection;
        });
    };

    const handleCompanyCountriesOptionChange = (option: string) => {
        setSelectedCompanyCountriesOptions((prevSelected) => {
            const updatedSelection = prevSelected.includes(option)
                ? prevSelected.filter((item) => item !== option)
                : [...prevSelected, option];
    
                setCompanyDetailsData({ ...companyDetailsData, employeesCountries: updatedSelection });
    
            return updatedSelection;
        });
    };

    const handleStructureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedStructureOption(e.target.value);
        if (e.target.value === structureOptions[structureOptions.length-1].value){
            if (otherStructureOption !== ""){
                setOtherStructureErrorMessage("");
                setCompanyDetailsData({ ...companyDetailsData, structure: otherStructureOption });
            } else {
                setOtherStructureErrorMessage("Enter your company structure");
            }
        } else {
            setCompanyDetailsData({ ...companyDetailsData, structure: e.target.value });
        }
    };

    const handleOtherStructureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtherStructureOption(e.target.value);
        if (selectedStructureOption === structureOptions[structureOptions.length-1].value){
            if (e.target.value !== ""){
                setOtherStructureErrorMessage("");
                setCompanyDetailsData({ ...companyDetailsData, structure: e.target.value });
            } else {
                setOtherStructureErrorMessage("Enter your company structure");
            }
        } else {
            setOtherStructureOption("");
        }
    };

    const handleRaiseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedRaiseOption(e.target.value);
        setCompanyDetailsData({ ...companyDetailsData, hasRaisedCapital: e.target.value === "Yes" });
    };

    const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmployeeOption(e.target.value);
        setCompanyDetailsData({ ...companyDetailsData, hasW2Employees: e.target.value === "Yes"});
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (companyDetailsCountryRef.current && !companyDetailsCountryRef.current.contains(event.target as Node)) {
            setIsCompanyCountriesOpen(false);
        }

        if (companyDetailsStateRef.current && !companyDetailsStateRef.current.contains(event.target as Node)) {
            setIsCompanyStatesOpen(false);
        }
    };

    return (
        <S.Container>
            <S.Form>
                <S.FormGroup>
                    <S.BoldLabel>How is your company structure?</S.BoldLabel>
                    <S.RadioGroupContainer>
                        {structureOptions.map((option, index) => (
                            <S.RadioOption key={index}>
                                <S.RadioButton
                                    type="radio"
                                    name="structureRadioGroup"
                                    value={option.value}
                                    checked={selectedStructureOption === option.value}
                                    onChange={handleStructureChange}
                                />
                                {option.label}
                            </S.RadioOption>
                        ))}
                    </S.RadioGroupContainer>
                </S.FormGroup>
                {selectedStructureOption === structureOptions[structureOptions.length - 1].value && (
                <S.FormGroup>
                    <S.Label>Other <span className="required">*</span></S.Label>
                    <S.Input
                        hasErrors={otherStructureErrorMessage != ""} 
                        type="text" 
                        id="name" 
                        value={otherStructureOption} 
                        placeholder="Enter your company structure"
                        onChange={handleOtherStructureChange}
                    />
                    {otherStructureErrorMessage && otherStructureErrorMessage != "" && <S.ErrorLabel>{otherStructureErrorMessage}</S.ErrorLabel>}
                </S.FormGroup>
                )}

                <S.FormGroup>
                    <S.BoldLabel>Have your company ever raised money or taken external capital?</S.BoldLabel>
                    <S.RadioGroupContainer>
                        {raiseOptions.map((option, index) => (
                            <S.RadioOption key={index}>
                                <S.RadioButton
                                    type="radio"
                                    name="raiseRadioGroup"
                                    value={option}
                                    checked={selectedRaiseOption === option}
                                    onChange={handleRaiseChange}
                                />
                                {option}
                            </S.RadioOption>
                        ))}
                    </S.RadioGroupContainer>
                </S.FormGroup>
                <S.FormGroup>
                    <S.BoldLabel>Have the company ever had W-2 employees? and where these employees are?</S.BoldLabel>
                    <S.RadioGroupContainer>
                        {employeeOptions.map((option, index) => (
                            <S.RadioOption key={index}>
                                <S.RadioButton
                                    type="radio"
                                    name="employeeRadioGroup"
                                    value={option}
                                    checked={selectedEmployeeOption === option}
                                    onChange={handleEmployeeChange}
                                />
                                {option}
                            </S.RadioOption>
                        ))}
                    </S.RadioGroupContainer>
                </S.FormGroup>
                {selectedEmployeeOption === employeeOptions[0] && (
                    <S.FormRowGroup>
                        <S.DropdownFormGroup>
                            <S.BoldLabel>US</S.BoldLabel>
                            <S.Label>US State <span className="required">*</span></S.Label>
                            <S.MultipleDropdownContainer ref={companyDetailsStateRef}>
                                <S.MultipleDropdownHeader onClick={toggleCompanyStatesDropdown} hasErrors={companyStateErrorMessage != ""} >
                                    {selectedCompanyStatesOptions.length > 0
                                        ? `${selectedCompanyStatesOptions.length} item(s) selected`
                                        : "Select State"}
                                    <S.SelectArrow src={arrow} flipped={isCompanyStatesOpen ? true : false}/>
                                </S.MultipleDropdownHeader>
                                {isCompanyStatesOpen && (
                                    <S.MultipleDropdownList>
                                        {states.map((state, index) => (
                                            <S.MultipleDropdownItem key={index}>
                                                <S.MultipleDropdownLabel htmlFor={`companyState-${state.code}`}>
                                                    <span>{state.name}</span>
                                                    <S.MultipleCheckbox
                                                        type="checkbox"
                                                        id={`companyState-${state.code}`}
                                                        checked={selectedCompanyStatesOptions.includes(state.code)}
                                                        onChange={() => handleCompanyStatesOptionChange(state.code)}
                                                    />
                                                </S.MultipleDropdownLabel>
                                            </S.MultipleDropdownItem>
                                        ))}
                                    </S.MultipleDropdownList>
                                )}
                                {selectedCompanyStatesOptions.length > 0 && (
                                    <S.MultipleSelectedItems>
                                        Selected: {selectedCompanyStatesOptions.join(", ")}
                                    </S.MultipleSelectedItems>
                                )}
                                {companyStateErrorMessage && companyStateErrorMessage != "" && <S.ErrorLabel>{companyStateErrorMessage}</S.ErrorLabel>}
                            </S.MultipleDropdownContainer>
                        </S.DropdownFormGroup>
                        <S.DropdownFormGroup>
                            <S.BoldLabel>Other countries</S.BoldLabel>
                            <S.Label>Country</S.Label>
                            <S.MultipleDropdownContainer ref={companyDetailsCountryRef}>
                                <S.MultipleDropdownHeader onClick={toggleCompanyCountriesDropdown} hasErrors={false}>
                                    {selectedCompanyCountriesOptions.length > 0
                                        ? `${selectedCompanyCountriesOptions.length} item(s) selected`
                                        : "Select Country"}
                                    <S.SelectArrow src={arrow} flipped={isCompanyCountriesOpen ? true : false}/>
                                </S.MultipleDropdownHeader>
                                {isCompanyCountriesOpen && (
                                    <S.MultipleDropdownList>
                                        {countries.map((country, index) => (
                                            <S.MultipleDropdownItem key={index}>
                                                <S.MultipleDropdownLabel htmlFor={`companyCountry-${country.code}`}>
                                                    <span>{country.name}</span>
                                                    <S.MultipleCheckbox
                                                        type="checkbox"
                                                        id={`companyCountry-${country.code}`}
                                                        checked={selectedCompanyCountriesOptions.includes(country.code)}
                                                        onChange={() => handleCompanyCountriesOptionChange(country.code)}
                                                    />
                                                </S.MultipleDropdownLabel>
                                            </S.MultipleDropdownItem>
                                        ))}
                                    </S.MultipleDropdownList>
                                )}
                                {selectedCompanyCountriesOptions.length > 0 && (
                                    <S.MultipleSelectedItems>
                                        Selected: {selectedCompanyCountriesOptions.join(", ")}
                                    </S.MultipleSelectedItems>
                                )}
                            </S.MultipleDropdownContainer>
                        </S.DropdownFormGroup>
                    </S.FormRowGroup>
                )}
            </S.Form>
        </S.Container>
    );
};

export default CompanyDetails;
