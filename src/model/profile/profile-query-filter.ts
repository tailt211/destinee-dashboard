import { MBTI_TYPE } from '../mbti-test/mbti-type.enum';
import { ORDER_BY } from '../order-by.enum';

export type ProfileSortBy =
    | 'callCount'
    | 'callDuration'
    | 'meanCallDuration'
    | 'droppedQueueRatio'
    | 'ratedRatio'
    | 'ratingRatio'
    | 'createdAt';

export interface ProfileQueryFilter {
    page?: number;
    limit?: number;
    search?: string;
    orderBy?: ORDER_BY;
    sortBy?: ProfileSortBy;
    mbtiType?: MBTI_TYPE;
    disabled?: boolean;
}
