import {
  DISSOLUTION_CLIENTS,
  LAWYER_CHATBOT_CLIENTS,
  PROSPECT_CLIENTS,
  CLIENT_ACTIVATION,
} from "./query.const";

export const ClientsTabsMap: Record<string, string> = {
  [CLIENT_ACTIVATION]: "Client Activation",
  [PROSPECT_CLIENTS]: "Prospective Clients",
  [LAWYER_CHATBOT_CLIENTS]: "Chatbot Clients",
};

export const CompanyTypeInitialsMap: Record<string, string> = {
  [PROSPECT_CLIENTS]: "P",
  [DISSOLUTION_CLIENTS]: "D",
  [LAWYER_CHATBOT_CLIENTS]: "CB",
};

export const CompanyTypeChips: Record<string, string> = {
  [PROSPECT_CLIENTS]: "bg-statesOrange-orange text-xl",
  [DISSOLUTION_CLIENTS]: "bg-secondaryComplementary text-xl",
  [LAWYER_CHATBOT_CLIENTS]: "bg-primaryLinkWater-900 text-sm",
};

export enum ClientsStage {
  NEW_REGISTERED_CLIENT = "NEW_REGISTERED_CLIENT",
  PENDING_INTAKE_CALL = "PENDING_INTAKE_CALL",
  CONTRACT_AND_FEE_PENDING = "CONTRACT_AND_FEE_PENDING",
  DECISIONS_AND_APPROVALS = "DECISIONS_AND_APPROVALS",
  ENGAGE_WITH_ENCORE_AND_IP_TRANSFER = "ENGAGE_WITH_ENCORE_AND_IP_TRANSFER",
  FILING_AND_NOTIFICATIONS = "FILING_AND_NOTIFICATIONS",
  PUBLIC_ANNOUNCEMENTS_AND_COMMUNICATIONS = "PUBLIC_ANNOUNCEMENTS_AND_COMMUNICATIONS",
  IP_ASSET_DISPOSITION = "IP_ASSET_DISPOSITION",
  SETTLEMENTS_AND_CLOSURES = "SETTLEMENTS_AND_CLOSURES",
  REGULATORY_COMPLIANCE_AND_RECORD_KEEPING = "REGULATORY_COMPLIANCE_AND_RECORD_KEEPING",
  AI_CHATBOT_ONLY = "AI_CHATBOT_ONLY",
  MIDDLE_OF_SHUTDOWN = "MIDDLE_OF_SHUTDOWN",
}

export enum CompanyStatusEnum {
  RECENTLY_DECIDED_SHUTDOWN = "RECENTLY_DECIDED_SHUTDOWN",
  MIDDLE_OF_SHUTDOWN = "MIDDLE_OF_SHUTDOWN",
  PARTIAL_UNWIND = "PARTIAL_UNWIND",
  DISTRESSED_SALE = "DISTRESSED_SALE",
  UNDECIDED = "UNDECIDED",
}

export enum CompanyServices{
  DISSOLUTION = "DISSOLUTION",
  AI_CHATBOT = "AI_CHATBOT",
}

export const CompanyServicesMap: Record<string, string> = {
  [CompanyServices.DISSOLUTION]: "Dissolution",
  [CompanyServices.AI_CHATBOT]: "AI Chatbot",
};

export const ClientsStageMap: Record<string, string> = {
  [ClientsStage.NEW_REGISTERED_CLIENT]: "New Registered Client",
  [ClientsStage.PENDING_INTAKE_CALL]: "Pending Intake Call",
  [ClientsStage.CONTRACT_AND_FEE_PENDING]: "Contract and Fee Pending",
  [ClientsStage.DECISIONS_AND_APPROVALS]: "Decisions and Approvals",
  [ClientsStage.ENGAGE_WITH_ENCORE_AND_IP_TRANSFER]:
    "Engage with Encore and IP Transfer",
  [ClientsStage.FILING_AND_NOTIFICATIONS]: "Filing and Notifications",
  [ClientsStage.PUBLIC_ANNOUNCEMENTS_AND_COMMUNICATIONS]:
    "Public Announcements and Communications",
  [ClientsStage.IP_ASSET_DISPOSITION]: "IP Asset Disposition",
  [ClientsStage.SETTLEMENTS_AND_CLOSURES]: "Settlements and Closures",
  [ClientsStage.REGULATORY_COMPLIANCE_AND_RECORD_KEEPING]:
    "Regulatory Compliance and Record Keeping",
  [ClientsStage.AI_CHATBOT_ONLY]: "AI Chatbot Only",
  [ClientsStage.MIDDLE_OF_SHUTDOWN]: "Middle of Shutdown",
};

export const CompanyStatusMap: Record<string, string> = {
  [CompanyStatusEnum.RECENTLY_DECIDED_SHUTDOWN]: "Recently Decided Shutdown",
  [CompanyStatusEnum.MIDDLE_OF_SHUTDOWN]: "Middle of Shutdown",
  [CompanyStatusEnum.PARTIAL_UNWIND]: "Partial Unwind",
  [CompanyStatusEnum.DISTRESSED_SALE]: "Distressed Sale",
  [CompanyStatusEnum.UNDECIDED]: "Undecided",
};

export const CompanyStatusData = Object.keys(CompanyStatusEnum).map((key) => ({
  label: CompanyStatusMap[key],
  value: key,
}));

export const ClientsStageData = Object.keys(ClientsStage).map((key) => ({
  label: ClientsStageMap[key],
  value: key,
}));

export enum LawyerRequestEnum {
  YES = "YES",
  NO = "NO",
}

const lawyerRequestDTO: Record<string, string> = {
  [LawyerRequestEnum.YES]: "yes",
  [LawyerRequestEnum.NO]: "no",
};

export const LawyerRequestsMap: Record<string, string> = {
  [LawyerRequestEnum.YES]: "Yes",
  [LawyerRequestEnum.NO]: "No",
};

export const LawyerRequestsData = Object.keys(LawyerRequestEnum).map((key) => ({
  label: LawyerRequestsMap[key],
  value: lawyerRequestDTO[key],
}));
