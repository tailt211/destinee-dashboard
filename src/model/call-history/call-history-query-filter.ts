import { ORDER_BY } from '../order-by.enum';
import { CALL_END_REASON } from './call-end-reason.enum';

export type CallHistorySortBy = 'createdAt' | 'duration' | 'compatibility';

export interface CallHistoryQueryFilter {
    page?: number;
    limit?: number;
    orderBy?: ORDER_BY;
    sortBy?: CallHistorySortBy;
    endReason?: CALL_END_REASON;
    participants?: string[];
}
