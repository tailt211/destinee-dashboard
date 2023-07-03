import { VNPayData } from "../dto/payment-detail.dto";
import { PAYMENT_CURRENCY } from "../payment-currency.enum";
import { PAYMENT_STATUS } from "../payment-status.enum";

export interface PaymentDetailRESP {
    id: string;
    gateway: string;
    description: string;
    amount: number;
    currency: PAYMENT_CURRENCY;
    status: PAYMENT_STATUS;
    createdAt: string;
    vnpayData: VNPayData;
}