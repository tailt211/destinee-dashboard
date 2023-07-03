import { ORDER_BY } from '../order-by.enum';
import { ROLE } from './roles.enum';

export interface AccountQueryFilter {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: ORDER_BY;
    sortBy?: 'createdAt';
    role?: ROLE;
    disabled?: boolean;
}
