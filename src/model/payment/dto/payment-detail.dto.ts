import { PAYMENT_CURRENCY } from "../payment-currency.enum";
import { PAYMENT_STATUS } from "../payment-status.enum";

export interface VNPayData {
    txnRef: string;
    orderType: string;
    amount: number;
    currency: PAYMENT_CURRENCY;
    ipAddr: string;
    createdDate: string;
    expireDate: string;
    bankCode: string;
    bankTransNo: string;
    cardType: string;
    payDate: string;
    respCode: string;
    status: string;
}

export interface PaymentDetailDTO {
    id: string;
    gateway: string;
    description: string;
    amount: number;
    currency: PAYMENT_CURRENCY;
    status: PAYMENT_STATUS;
    createdAt: string;
    vnpayData: VNPayData;
}