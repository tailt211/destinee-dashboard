import { ORDER_STATUS } from "../order-status.enum";

export interface OrderRESP {
    id: string;
    owner: {
        id: string;
        avatarUrl: string;
        name: string;
        username: string;
    };
    description: string;
    paymentId: string;
    status: ORDER_STATUS;
    totalPrice: number;
    createdAt: string;
}


