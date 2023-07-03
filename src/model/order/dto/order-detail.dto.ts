import { PACKAGE } from "../../account/packages.enum";
import { ORDER_STATUS } from "../order-status.enum";

export interface PackageItem {
    service: PACKAGE;
    amount: number;
    price: number;
}

export interface OrderDetailDTO {
    id: string;
    owner: {
        id: string;
        avatarUrl: string;
        name: string;
        username: string;
    };
    status: ORDER_STATUS;
    totalPrice: number;
    createdAt: string;
    items: PackageItem[];
}

