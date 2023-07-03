import { PackageItem } from "../dto/order-detail.dto";
import { ORDER_STATUS } from "../order-status.enum";

export interface OrderDetailRESP {
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
