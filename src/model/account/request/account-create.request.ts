import { ROLE } from "../roles.enum";

export interface AccountCreateREQ {
    email: string,
    password: string,
    role: ROLE
}