import { CountryCode } from "libphonenumber-js";

export interface CountryData {
    code: CountryCode;
    name: string;
    callingCode: string;
}

export interface StateData {
    code: string;
    name: string;
}

export interface User {
    id: string;
    name: string | null;
    email: string;
    phoneNumber: string | null,
    lastPasswordChange: Date | null,
    isVerified: boolean,
    createdAt: Date,
    updatedAt: Date,
    accessToken: string,
}

export interface Company {
    id: string;
    name: string;
    industryId: string;
    parentCompanyId: string | null,
    structure: string | null,
    currentStage: string | null,
    hasRaisedCapital: string | null,
    hasW2Employees: string | null,
    hasCompletedSetup: boolean
}

export interface BasicInfoData {
    fullname: string,
    phone: string,
    companyName: string,
    industryId: string,
    otherCountries: string[] | null,
    states: string[]
}

export interface CompanyDetailsData {
    structure: string,
    hasRaisedCapital: boolean,
    hasW2Employees: boolean,
    employeesStates: string[] | null,
    employeesCountries: string[] | null
}

export interface CompanyStatusData {
    currentStage: string
}

export interface CallScheduleData {
    channelPreference: string;
    date: Date;
    callScheduled: boolean;
}

export interface IndustryData {
    id: string,
    name: string
}

export interface TimeZone {
    value: string,
    abbr: string,
    offset: number,
    isdst: boolean,
    text: string,
    utc: string[]
}