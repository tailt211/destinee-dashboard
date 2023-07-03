import { ORDER_BY } from '../order-by.enum';
import { MBTI_PROCESSING_STATE } from './mbti-processing-state.enum';
import { MBTI_TYPE } from './mbti-type.enum';

export type MbtiTestSortBy = 'createdAt';

export interface MbtiTestQueryFilter {
    page?: number;
    limit?: number;
    orderBy?: ORDER_BY;
    sortBy?: MbtiTestSortBy;
    owner?: string;
    mbtiType?: MBTI_TYPE;
    processingState?: MBTI_PROCESSING_STATE;
}
