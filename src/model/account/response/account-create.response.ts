import { ROLE } from '../roles.enum';

export interface AccountCreateRESP {
    _id: string;
    uid: string;
    email: string;
    role: ROLE;
    // upgrade?: AccountUpgrade;
    disabled: boolean;
    createdAt: string;
    updateAt: string;
}