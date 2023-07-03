export interface PerProfileMeanQueueDurationRESP {
    _id: string;
    meanQueueDuration: number;
    meanSucceededQueueDuration: number;
    meanDroppedQueueDuration: number;
    profileCount: number;
}
