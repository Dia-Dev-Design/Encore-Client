import { UserType } from "./userType.enum";

export interface Connection {
    token: string,
    userType: UserType,
}