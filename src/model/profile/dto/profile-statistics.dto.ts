import { REVIEW } from "../../call-history/review.enum";

export interface ProfileStatisticsDTO {
    callCount: number;
    callDuration: number;
    meanCallDuration: number;
    meanSucceededQueueDuration: number;
    meanQueueDuration: number;
    droppedQueueCount: number;
    meanDroppedQueueDuration: number;
    droppedQueueRatio: number;
    ratingRatio: number;
    ratedRatio: number;
    keywordsReviewed: { keyword: REVIEW; count: number }[];
}
