import { Company, User } from "./interfaces";

export const parseUser = (data: any): User => {
    return {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phoneNumber: data.user.phoneNumber,
        lastPasswordChange: data.user.lastPasswordChange ? new Date(data.user.lastPasswordChange) : null,
        isVerified: data.user.isVerified,
        createdAt: new Date(data.user.createdAt),
        updatedAt: new Date(data.user.updatedAt),
        accessToken: data.accessToken,
    };
};

export const parseCompany = (data: any): Company => {
    return {
        id: data.company.id,
        name: data.company.name,
        industryId: data.company.industryId,
        parentCompanyId: data.company.parentCompanyId ? data.company.parentCompanyId : null,
        structure: data.company.structure ? data.user.structure : null,
        currentStage: data.company.currentStage,
        hasRaisedCapital: data.company.hasRaisedCapital ? data.user.hasRaisedCapital : null,
        hasW2Employees: data.company.hasW2Employees ? data.user.hasW2Employees : null,
        hasCompletedSetup: data.company.hasCompletedSetup
    };
};