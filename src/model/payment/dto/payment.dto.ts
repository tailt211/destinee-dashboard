import { PAYMENT_CURRENCY } from "../payment-currency.enum";
import { PAYMENT_STATUS } from "../payment-status.enum";

export interface PaymentDTO {
    id: string;
    orderId: string;
    gateway: string;
    description: string;
    amount: number;
    currency: PAYMENT_CURRENCY;
    status: PAYMENT_STATUS;
    createdAt: string;
}


