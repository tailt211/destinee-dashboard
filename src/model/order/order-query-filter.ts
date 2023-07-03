import { ORDER_BY } from '../order-by.enum';
import { ORDER_STATUS } from './order-status.enum';

export type OrderSortBy = 'createdAt' | 'totalPrice';

export interface OrderQueryFilter {
    page?: number;
    limit?: number;
    orderBy?: ORDER_BY;
    sortBy?: OrderSortBy;
    status?: ORDER_STATUS;
    owner?: string;
}
