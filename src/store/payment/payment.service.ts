import moment from 'moment';
import { destineeApi } from '../../https';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaginationRESP } from '../../model/pagination.response';
import { PaymentDetailDTO } from '../../model/payment/dto/payment-detail.dto';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { PAYMENT_STATUS } from '../../model/payment/payment-status.enum';
import { PaymentDetailRESP } from '../../model/payment/response/payment-detail.response';
import { PaymentRESP } from '../../model/payment/response/payment.response';

export const fetchPayments = async (
    limit?: number,
    page?: number,
    orderBy?: ORDER_BY,
    sortBy?: string,
    status?: PAYMENT_STATUS,
    gateway?: string,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<PaymentRESP>>(`/payments/dashboard`, {
                params: { limit, page, orderBy, sortBy, status, gateway },
            })
        ).data;
        return {
            payments: data.results.map((payment) => ({
                id: payment.id,
                orderId: payment.orderId,
                gateway: payment.gateway,
                description: payment.description,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                createdAt: payment.createdAt,
            })) as PaymentDTO[],
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải danh sách lịch sử thanh toán');
    }
};

export const fetchPayment = async (id: string) => {
    try {
        const data = (await destineeApi.get<PaymentDetailRESP>(`/payments/${id}/dashboard`)).data;
        return {
            id: data.id,
            gateway: data.gateway,
            description: data.description,
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            createdAt: data.createdAt,
            vnpayData: {
                txnRef: data.vnpayData.txnRef,
                orderType: data.vnpayData.orderType,
                amount: data.vnpayData.amount,
                currency: data.vnpayData.currency,
                ipAddr: data.vnpayData.ipAddr,
                createdDate: moment(data.vnpayData.createdDate, 'YYYYMMDDHHmmss').toISOString(),
                expireDate: moment(data.vnpayData.expireDate, 'YYYYMMDDHHmmss').toISOString(),
                bankCode: data.vnpayData.bankCode,
                bankTransNo: data.vnpayData.bankTransNo,
                cardType: data.vnpayData.cardType,
                payDate: moment(data.vnpayData.payDate, 'YYYYMMDDHHmmss').toISOString(),
                respCode: data.vnpayData.respCode,
                status: data.vnpayData.status
            }
        } as PaymentDetailDTO;
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải lịch sử thanh toán');
    }
};