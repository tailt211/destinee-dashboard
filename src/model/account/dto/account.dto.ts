import { PACKAGE } from "../packages.enum";
import { ROLE } from "../roles.enum";

export interface AccountUpgrade {
    package: PACKAGE;
    expiredDate: Date;
}

export interface AccountDTO {
    id: string;
    uid?: string;
    email: string;
    role: ROLE;
    profileId?: string;
    upgrade?: AccountUpgrade;
    disabled: boolean;
    createdAt: string;
}


