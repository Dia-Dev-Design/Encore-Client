import React, { useEffect, useRef, useState } from "react";
import { isValidPhoneNumber } from "libphonenumber-js";
import * as S from "./styles";
import arrow from "assets/icons/Arrow.png";
import { countries, states } from "utils/constants";
import {
  BasicInfoData,
  CountryData,
  User,
  Industry
} from "utils/interfaces";
import { industryOptions } from "utils/constants";
import { getLocalItem } from "helper/localStorage.helper";
import axios from "axios";

import { useAuth } from "context/auth.context";

interface BasicInfoProps {
  basicInfoData: BasicInfoData;
  setBasicInfoData: (data: BasicInfoData) => void;
  basicInfoErrors: string[];
}

interface UserData {
  accessToken: string,
  isAdmin: boolean,
  user: {    
    createdAt: string
    email: string
    id: string
    isAdmin: boolean
    isVerified: boolean
    lastPasswordChange: string | null
    name: string
    password: string
    phoneNumber: string
    updatedAt: string
  }
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  basicInfoData,
  setBasicInfoData,
  basicInfoErrors,
}) => {
  const dropdownCountryCodeRef = useRef<HTMLDivElement>(null);
  const dropdownStateRef = useRef<HTMLDivElement>(null);
  const dropdownCountryRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [accessToken, setAccessToken] = useState<string | undefined>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | ''>('');
  const [fullNameErrorMessage, setFullNameErrorMessage] = useState<string>("");
  const [countryCodeErrorMessage, setCountryCodeErrorMessage] =
    useState<string>("");
  const [phoneNumberErrorMessage, setPhoneNumberErrorMessage] =
    useState<string>("");
  const [companyNameErrorMessage, setCompanyNameErrorMessage] =
    useState<string>("");
  const [industryTypeErrorMessage, setIndustryTypeErrorMessage] =
    useState<string>("");
  const [companyStateErrorMessage, setCompanyStateErrorMessage] =
    useState<string>("");
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    countries.find((industry) => industry.code === "US") || {
      code: "US",
      name: "United States",
      callingCode: "+1",
    }
  );
  const toggleCountryCodeDropdown = () =>
    setIsCountryCodeOpen(!isCountryCodeOpen);
  const [isCompanyStatesOpen, setIsCompanyStatesOpen] =
    useState<boolean>(false);
  const [isCompanyCountriesOpen, setIsCompanyCountriesOpen] =
    useState<boolean>(false);
  const [selectedCompanyStatesOptions, setSelectedCompanyStatesOptions] =
    useState<string[]>([]);
  const [selectedCompanyCountriesOptions, setSelectedCompanyCountriesOptions] =
    useState<string[]>([]);

  const toggleCompanyStatesDropdown = () =>
    setIsCompanyStatesOpen(!isCompanyStatesOpen);
  const toggleCompanyCountriesDropdown = () =>
    setIsCompanyCountriesOpen(!isCompanyCountriesOpen);

  const { user } = useAuth()

  const getStep1Data = async (
    accessToken: string,
    companyId: string
  ): Promise<boolean> => {
    console.log("This is step one data=====>", accessToken, companyId)
    try {
      const response = await fetch(
        process.env.REACT_APP_API_BASE_URL + "api/register/step1/" + companyId,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + accessToken || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error gathering data");
      }
      const dataReceived: BasicInfoData = await response.json();
      setBasicInfoData(dataReceived);
      setPhoneNumber(
        dataReceived.phone
          .replace("+", "")
          .replace(selectedCountry.callingCode, "")
      );
      // const industry = industries.find(
      //   (industry) => industry.id === dataReceived.industryId
      // );
      setSelectedIndustry('');
      setSelectedCompanyStatesOptions(basicInfoData.states);
      if (basicInfoData.otherCountries) {
        setSelectedCompanyCountriesOptions(basicInfoData.otherCountries);
      }

      return true;
    } catch (error) {
      console.error("Failed to gather data:", error);
      return false;
    }
  };

  // const getIndustriesData = async (accessToken: string): Promise<any> => {
  //   console.log(
  //     "This is our industries endpoint====>",
  //     process.env.REACT_APP_API_BASE_URL + "api/industries"
  //   );
  //   try {
  //     console.log("Fetching industries data...");
  //     const response = await axios.get(
  //       process.env.REACT_APP_API_BASE_URL + "api/industries",
  //       {
  //         headers: {
  //           Accept: "application/json",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     // const response = await fetch(process.env.REACT_APP_API_BASE_URL+"api/industries", {
  //     //     method: "GET",
  //     //     headers: { "Accept": "application/json", "Authorization":  "Bearer "+accessToken || "" },
  //     // });

  //     if (response.status !== 200) {
  //       throw new Error("Error gathering data");
  //     }
  //     const dataReceived: IndustryData[] = await response.data;
  //     setindustries([...dataReceived]);
  //     return response
  //   } catch (error) {
  //     console.error("Failed to gather data:", error);
  //     return error
  //   }
  // };

  // export const post = (route, body) => {
  //     let token = localStorage.getItem("authToken");

  //     return axios.post(API_URL + route, body, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //   };

  const handleSelectCountryCode = (country: CountryData) => {
    if (country) {
      setCountryCodeErrorMessage("");
      setSelectedCountry(country);
      setIsCountryCodeOpen(false);
    } else {
      setCountryCodeErrorMessage("Invalid Country Code");
    }
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Industry;
    setSelectedIndustry(value);
    setBasicInfoData({ ...basicInfoData, industryId: value });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (e.target.value !== "") {
      if (selectedCountry) {
        if (
          isValidPhoneNumber(
            selectedCountry.callingCode + e.target.value,
            selectedCountry.code
          )
        ) {
          setPhoneNumberErrorMessage("");
          setBasicInfoData({
            ...basicInfoData,
            phone: "+" + selectedCountry.callingCode + e.target.value,
          });
        } else {
          setPhoneNumberErrorMessage("Introduce a valid phone number");
        }
      } else {
        setCountryCodeErrorMessage("Select a country code");
      }
    } else {
      setPhoneNumberErrorMessage("");
    }
  };

  const handleCompanyStatesOptionChange = (option: string) => {
    setSelectedCompanyStatesOptions((prevSelected) => {
      const updatedSelection = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      setBasicInfoData({ ...basicInfoData, states: updatedSelection });

      return updatedSelection;
    });
  };

  const handleCompanyCountriesOptionChange = (option: string) => {
    setSelectedCompanyCountriesOptions((prevSelected) => {
      const updatedSelection = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];

      setBasicInfoData({ ...basicInfoData, otherCountries: updatedSelection });

      return updatedSelection;
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownCountryCodeRef.current &&
      !dropdownCountryCodeRef.current.contains(event.target as Node)
    ) {
      setIsCountryCodeOpen(false);
    }

    if (
      dropdownCountryRef.current &&
      !dropdownCountryRef.current.contains(event.target as Node)
    ) {
      setIsCompanyCountriesOpen(false);
    }

    if (
      dropdownStateRef.current &&
      !dropdownStateRef.current.contains(event.target as Node)
    ) {
      setIsCompanyStatesOpen(false);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      // const jsonUser = getLocalItem("user");
      // const jsonCompany = getLocalItem('company');
      if (user) {
        // const tempUser = JSON.parse(jsonUser);
        // console.log(
        //   "this is tempuser and company+++++>",
        //   tempUser,
        //   "and basicInfoData---->",
        //   basicInfoData
        // );
        setUserData(user);
        console.log("This is data temp")
        setAccessToken(user.accessToken);


        if (accessToken) {
          // const response = await getIndustriesData(
          //   accessToken
          // );
          // console.log("This is our response in industries useEffect", response.data);
          // if (response.data) {
            // const tempCompany = JSON.parse(jsonCompany)
            getStep1Data(accessToken, basicInfoData.companyName);
            // setTimeout(() => {
              
            // }, 800)
          }
        }
    }
    
    getUserData();
  }, [user, accessToken, userData]);

  useEffect(() =>{
    setIndustries(industryOptions)
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const errorMessages: { [key: string]: (message: string) => void } = {
      fullname: setFullNameErrorMessage,
      phone: setPhoneNumberErrorMessage,
      companyName: setCompanyNameErrorMessage,
      industryId: setIndustryTypeErrorMessage,
      countryCode: setPhoneNumberErrorMessage,
      state: setCompanyStateErrorMessage,
    };

    Object.entries(errorMessages).forEach(([field, setErrorMessage]) => {
      if (basicInfoErrors.includes(field)) {
        switch (field) {
          case "fullname":
            setErrorMessage("Type your full name");
            break;
          case "phone":
            setErrorMessage("Enter a phone number");
            alert("Enter a phone number");
            break;
          case "companyName":
            setErrorMessage("Enter a company name");
            break;
          case "industryId":
            setErrorMessage("Enter an Industry Type");
            break;
          case "states":
            setErrorMessage("Select at least one State");
            alert("Select at least one State");
            break;
          default:
            setErrorMessage("");
        }
      } else {
        setErrorMessage("");
      }
    });
  }, [basicInfoErrors]);

  return (
    <S.Container>
      <S.TitleContainer>
        <S.RegisterTitle>Provide your details</S.RegisterTitle>
        <S.EmailRegistered>
          Your registered email: <span>{userData?.user.email}</span>
        </S.EmailRegistered>
      </S.TitleContainer>
      <S.Form>
        <S.FormGroup>
          <S.Label>
            Full Name <span className="required">*</span>
          </S.Label>
          <S.Input
            hasErrors={fullNameErrorMessage != ""}
            type="text"
            id="name"
            value={basicInfoData.fullname}
            placeholder="Enter your full name"
            onChange={(e) =>
              setBasicInfoData({ ...basicInfoData, fullname: e.target.value })
            }
          />
          {fullNameErrorMessage && fullNameErrorMessage != "" && (
            <S.ErrorLabel>{fullNameErrorMessage}</S.ErrorLabel>
          )}
        </S.FormGroup>
        <S.FormRowGroup>
          <S.NarrowFormGroup>
            <S.Label>
              Country Code <span className="required">*</span>
            </S.Label>
            <S.DropdownContainer>
              <S.DropdownHeader
                ref={dropdownCountryCodeRef}
                onClick={toggleCountryCodeDropdown}
                hasErrors={countryCodeErrorMessage != ""}
              >
                {selectedCountry ? (
                  <S.DropdownOption>
                    <S.SelectedFlag
                      src={`https://flagcdn.com/h20/${selectedCountry.code.toLowerCase()}.png`}
                      alt={`${selectedCountry.name} flag`}
                    />
                    {selectedCountry.code}
                  </S.DropdownOption>
                ) : (
                  <S.DropdownOption>Select</S.DropdownOption>
                )}
                <S.SelectArrow
                  src={arrow}
                  flipped={isCountryCodeOpen ? true : false}
                />
              </S.DropdownHeader>

              {isCountryCodeOpen && (
                <S.DropdownList>
                  {countries.map((country) => (
                    <S.DropdownItem
                      key={country.code}
                      onClick={() => handleSelectCountryCode(country)}
                    >
                      <S.ItemFlag
                        src={`https://flagcdn.com/h20/${country.code.toLowerCase()}.png`}
                        alt={`${country.name} flag`}
                      />
                      {country.name}
                    </S.DropdownItem>
                  ))}
                </S.DropdownList>
              )}
            </S.DropdownContainer>
            {countryCodeErrorMessage && countryCodeErrorMessage != "" && (
              <S.ErrorLabel>{countryCodeErrorMessage}</S.ErrorLabel>
            )}
          </S.NarrowFormGroup>

          <S.WideFormGroup>
            <S.Label>
              Phone Number <span className="required">*</span>
            </S.Label>
            <S.Input
              hasErrors={phoneNumberErrorMessage != ""}
              type="text"
              id="name"
              autoComplete="tel"
              value={phoneNumber}
              placeholder="Enter Phone number"
              onChange={handlePhoneNumberChange}
            />
            {phoneNumberErrorMessage && phoneNumberErrorMessage != "" && (
              <S.ErrorLabel>{phoneNumberErrorMessage}</S.ErrorLabel>
            )}
          </S.WideFormGroup>
        </S.FormRowGroup>
        <S.FormGroup>
          <S.Label>
            Company Name <span className="required">*</span>
          </S.Label>
          <S.Input
            hasErrors={companyNameErrorMessage != ""}
            type="text"
            id="name"
            value={basicInfoData.companyName}
            placeholder="Enter company name"
            onChange={(e) =>
              setBasicInfoData({
                ...basicInfoData,
                companyName: e.target.value,
              })
            }
          />
          {companyNameErrorMessage && companyNameErrorMessage != "" && (
            <S.ErrorLabel>{companyNameErrorMessage}</S.ErrorLabel>
          )}
        </S.FormGroup>
        <S.FormGroup>
          <S.Label>
            Industry type <span className="required">*</span>
          </S.Label>
          <S.NormalDropdown
            value={selectedIndustry}
            onChange={handleIndustryChange}
            hasErrors={industryTypeErrorMessage != ""}
          >
            <S.NormalOption value="" disabled>
              Select an Industry
            </S.NormalOption>
            {industries.map((industry: Industry) => (
              <S.NormalOption key={industry} value={industry}>
                {industry}
              </S.NormalOption>
            ))}
          </S.NormalDropdown>
          {industryTypeErrorMessage && industryTypeErrorMessage != "" && (
            <S.ErrorLabel>{industryTypeErrorMessage}</S.ErrorLabel>
          )}
        </S.FormGroup>
        <S.FormGroup>
          <S.RegisterTitle>
            Where is your company located?
            <S.TooltipWrapper>
              <S.TooltipIcon style={{ color: "blue" }}>*</S.TooltipIcon>
              <S.TooltipText>
                Use the checkboxes in the dropdown to select multiple countries,
                states, or locations as needed
              </S.TooltipText>
            </S.TooltipWrapper>
          </S.RegisterTitle>
          <S.FormRowGroup>
            <S.DropdownFormGroup>
              <S.BoldLabel>US</S.BoldLabel>
              <S.Label>
                US State <span className="required">*</span>
              </S.Label>
              <S.MultipleDropdownContainer ref={dropdownStateRef}>
                <S.MultipleDropdownHeader
                  onClick={toggleCompanyStatesDropdown}
                  hasErrors={companyStateErrorMessage != ""}
                >
                  {selectedCompanyStatesOptions.length > 0
                    ? `${selectedCompanyStatesOptions.length} item(s) selected`
                    : "Select State"}
                  <S.SelectArrow
                    src={arrow}
                    flipped={isCompanyStatesOpen ? true : false}
                  />
                </S.MultipleDropdownHeader>
                {isCompanyStatesOpen && (
                  <S.MultipleDropdownList>
                    {states.map((state, index) => (
                      <S.MultipleDropdownItem key={index}>
                        <S.MultipleDropdownLabel
                          htmlFor={`companyState-${state.code}`}
                        >
                          <span>{state.name}</span>
                          <S.MultipleCheckbox
                            type="checkbox"
                            id={`companyState-${state.code}`}
                            checked={selectedCompanyStatesOptions.includes(
                              state.code
                            )}
                            onChange={() =>
                              handleCompanyStatesOptionChange(state.code)
                            }
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
                {companyStateErrorMessage && companyStateErrorMessage != "" && (
                  <S.ErrorLabel>{companyStateErrorMessage}</S.ErrorLabel>
                )}
              </S.MultipleDropdownContainer>
            </S.DropdownFormGroup>
            <S.DropdownFormGroup>
              <S.BoldLabel>Other countries</S.BoldLabel>
              <S.Label>Country</S.Label>
              <S.MultipleDropdownContainer ref={dropdownCountryRef}>
                <S.MultipleDropdownHeader
                  onClick={toggleCompanyCountriesDropdown}
                  hasErrors={false}
                >
                  {selectedCompanyCountriesOptions.length > 0
                    ? `${selectedCompanyCountriesOptions.length} item(s) selected`
                    : "Select Country"}
                  <S.SelectArrow
                    src={arrow}
                    flipped={isCompanyCountriesOpen ? true : false}
                  />
                </S.MultipleDropdownHeader>
                {isCompanyCountriesOpen && (
                  <S.MultipleDropdownList>
                    {countries.map((country, index) => (
                      <S.MultipleDropdownItem key={index}>
                        <S.MultipleDropdownLabel
                          htmlFor={`companyCountry-${country.code}`}
                        >
                          <span>{country.name}</span>
                          <S.MultipleCheckbox
                            type="checkbox"
                            id={`companyCountry-${country.code}`}
                            checked={selectedCompanyCountriesOptions.includes(
                              country.code
                            )}
                            onChange={() =>
                              handleCompanyCountriesOptionChange(country.code)
                            }
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
        </S.FormGroup>
      </S.Form>
    </S.Container>
  );
};

export default BasicInfo;
