import { ORDER_BY } from '../order-by.enum';
import { PAYMENT_STATUS } from './payment-status.enum';

export type PaymentSortBy = 'createdAt' | 'amount';

export interface PaymentQueryFilter {
    page?: number;
    limit?: number;
    orderBy?: ORDER_BY;
    sortBy?: PaymentSortBy;
    status?: PAYMENT_STATUS;
    gateway?: string;
}
