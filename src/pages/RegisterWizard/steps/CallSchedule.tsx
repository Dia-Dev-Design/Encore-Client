import React, { useEffect, useState } from "react";
import { useCalendlyEventListener, InlineWidget } from 'react-calendly';
import * as S from './styles';
import { CallScheduleData, User } from "utils/interfaces";
import { getLocalItem } from "helper/localStorage.helper";

interface CallScheduleProps {
    callScheduleData: CallScheduleData;
    setCallScheduleData: (data: CallScheduleData) => void;
    callScheduleErrors: string[];
    setVisibleConfirm: (value: boolean) => void;
    completedSteps: number[];
    setCompletedSteps: (value: number[]) => void;
}

const CallSchedule: React.FC<CallScheduleProps> = ({ 
    callScheduleData, setCallScheduleData, callScheduleErrors, setVisibleConfirm, completedSteps, setCompletedSteps 
}) => {
    const channelPreferences = [
        {id:"GoogleMeet", label:"Google Meet"},
        {id:"PhoneCall", label:"Phone call"}
    ];
    const [userData, setUserData] = useState<User>();
    const [selectedChannelOption, setSelectedChannelOption] = useState<string>(channelPreferences[0].id);
    const [timeZoneErrorMessage, setTimeZoneErrorMessage] = useState<string>("");

    useCalendlyEventListener({
        onDateAndTimeSelected: (e) => setTimeZoneErrorMessage(""),
        onEventScheduled: (e) => {
            setCallScheduleData({ ...callScheduleData, callScheduled: true });
            setCompletedSteps([...completedSteps, 3]);
            setVisibleConfirm(true);
        },
    });

    useEffect(() => {
        setVisibleConfirm(false);

        const jsonUser = getLocalItem("user");
        if (jsonUser){
            const tempUser = JSON.parse(jsonUser)
            setUserData(tempUser);
            
        } else {
            console.error("Error getting user");
        }
    }, []);

    useEffect(() => {
        if (userData){
            checkUserStatus(userData.accessToken);
        }
    }, [userData]);


    useEffect(() => {
        const errorMessages: { [key: string]: (message: string) => void } = {
            callScheduled: setTimeZoneErrorMessage,
        };
    
        Object.entries(errorMessages).forEach(([field, setErrorMessage]) => {
            if (callScheduleErrors.includes(field)) {
                switch (field) {
                    case "callScheduled":
                        setErrorMessage("Pick a date for a call");
                        break;
                    default:
                        setErrorMessage("");
                }
            } else {
                setErrorMessage("");
            }
        });
    }, [callScheduleErrors]);

    const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedChannelOption(e.target.value);
        setCallScheduleData({ ...callScheduleData, channelPreference: e.target.value });
    };

    const checkUserStatus = async (token: string) => {
        
        try {
            const response = await fetch(process.env.REACT_APP_API_BASE_URL+"api/auth/me", {
                method: "GET", 
                headers: { "Accept": "application/json", "Authorization":  "Bearer "+token || "" },
            });

            if (response.ok) {
                const data = await response.json();
                let user = userData;
                if (user && !userData?.name) {
                    user.name = data.name;
                    setUserData(user);
                }
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.message || 'Error gathering data. Please try again.';
                console.error(errorMessage);
            }
        } catch (error) {
            console.error('Error gathering data. Please try again:', error);
        }
    };

    return (
        <S.Container>
            <S.TitleContainer>
                <S.RegisterTitle>Done! Let us call you to talk more!</S.RegisterTitle>
            </S.TitleContainer>
            <S.Form>
                <S.FormRowGroup>
                    <S.BoldLabel>1. Select you call channel preference</S.BoldLabel>
                    <S.RadioGroupContainer>
                        {channelPreferences.map((option, index) => (
                            <S.RadioOption key={index}>
                                <S.RadioButton
                                    type="radio"
                                    name="channelRadioGroup"
                                    value={option.id}
                                    checked={selectedChannelOption == option.id}
                                    onChange={handleChannelChange}
                                />
                                {option.label}
                            </S.RadioOption>
                        ))}
                    </S.RadioGroupContainer>
                </S.FormRowGroup>
                <InlineWidget
                    url="https://calendly.com/admin-startupencore/30min" 
                    pageSettings={{
                        backgroundColor: 'FFFFFF',
                        hideEventTypeDetails: false,
                        hideLandingPageDetails: false,
                        primaryColor: '2695B4',
                        textColor: '6F7886'
                    }}
                    prefill={{
                        name: userData?.name ? userData?.name : "",
                        email: userData?.email ? userData?.email : "",
                    }}
                />
                {timeZoneErrorMessage && timeZoneErrorMessage != "" && <S.ErrorLabel>{timeZoneErrorMessage}</S.ErrorLabel>}
            </S.Form>
        </S.Container>
    );
};

export default CallSchedule;
