import { ROLE } from '../roles.enum';

export interface AccountRESP {
    _id: string;
    uid: string;
    email: string;
    role: ROLE;
    profile?: {
        _id?: string;
    };
    // upgrade?: AccountUpgrade;
    disabled: boolean;
    createdAt: string;
}