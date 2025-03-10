export interface IndustryType {
  id: string;
  name: string;
}

export interface ServicesType {
  name: string;
  enabled: boolean;
}

export interface ToggleCompanyServicesRequest {
  service: string;
  enabled: boolean;
}

export interface IntakeCallFormRequest{
  structure: string;
  hasRaisedCapital: boolean;
  hasW2Employees: boolean;
  stateW2Employees: string;
  hasOperationOutsideUS: boolean;
  countryOperationOutsideUS: string;
  hasIntellectualProperty: boolean;
  intellectualProperty: IntellectualProperty[];
  hasPendingIPApplication: boolean;
  pendingIPApplicationDetails: string;
  areEmployeesInBargainingAgreements: boolean;
  employeesInBargainingAgreementsDetails: string;
  hasEstatePropertyOrEquipment: boolean;
  estatePropertyOrEquipmentDetails: string;
  hasFinalcialObligations: boolean;
  finalcialObligationsDetails: string;
  hasIntendToHaveAsset: boolean;
  intendToHaveAssetDetails: string;
  hasOngoingNegotationsForSale: boolean;
  ongoingNegotationsForSaleDetails: string;
  hasReceivedOffers: boolean;
  hasReceivedOffersDetails: string;

}

export interface IntellectualProperty {
  type: string;
  registrationNumber: string;
  jurisdiction: string;
}

export interface CompanyResponse {
  id: string;
  name: string;
  contactName: string;
  emailAddress: string;
  phone: string;
  industryType: IndustryType;
  states: string[];
  otherCountries: string[];
  currentStage: string;
  type: string;
  services: ServicesType[];
}

export interface DataType {
  key: number;
  id: string;
  date: string;
  time: string;
  joinUrl: string;
  status: string;
  meetingType: string;
  actions: React.ReactNode;
}

export interface Props {
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<React.Key[]>>;
  isPage?: boolean;
}

export interface Params {
  callScheduleLimit: number;
  callSchedulePage: number;
  callScheduleCurrentStage: string;
  callScheduleSearch: string;
  tableTab: string;
  limit: number;
  callScheduleSortOption?: string | null;
  callScheduleSortOrder?: string | null;
}
