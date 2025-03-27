export interface ClientDataReceived {
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    isVerified: boolean;
    hasRegisteredCompanies: boolean;
    companies: [{
        id: string;
        name: string;
        industryId: string;
        parentCompanyId: string | null;
        structure: string | null;
        otherStructure: string | null;
        currentStage: string;
        status: string;
        otherStage: string | null;
        hasRaisedCapital: string | null;
        hasW2Employees: boolean | null;
        hasCompletedSetup: boolean;
        hasBeenEvaluated: boolean;
        hasPaidTheFee: boolean;
        assignedAdminId: string;
        rootFolderId: string | null;
    }];
    user?: {
        name: string;
        id: string;
        email: string;
        [key: string]: any;
    };
}
