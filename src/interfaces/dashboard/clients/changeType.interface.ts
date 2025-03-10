export interface ChangeTypeInterface {
  companyIds: React.Key[] | undefined;
  serviceType: ChangeTypeEnum;
}

export enum ChangeTypeEnum {
  DISSOLUTION = "DISSOLUTION",
  AI_CHATBOT = "AI_CHATBOT",
}
