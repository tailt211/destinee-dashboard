export interface PerProfileMeanQueueDurationDTO {
    id: string;
    meanQueueDuration: number;
    meanSucceededQueueDuration: number;
    meanDroppedQueueDuration: number;
    profileCount: number;
}
