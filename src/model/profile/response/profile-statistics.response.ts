export interface ProfileStatisticsRESP {
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
    keywordsReviewed: { keyword: string; count: number }[];
}
