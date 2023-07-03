import { ORDER_BY } from '../order-by.enum';

export type CallQuestionSortBy = 'createdAt' | 'viewCount';

export interface CallQuestionQueryFilter {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: ORDER_BY;
    sortBy?: CallQuestionSortBy;
    disabled?: boolean;
}
