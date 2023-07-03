import { httpExceptionConverter } from '../../exception/http-exception.converter';
import { destineeApi } from '../../https';
import { PerProfileCallCountDTO } from '../../model/statistics/dto/statistics-per-profile-call-count.dto';
import { PerProfileCallDurationDTO } from '../../model/statistics/dto/statistics-per-profile-call-duration.dto';
import { PerProfileDroppedQueueRatioDTO } from '../../model/statistics/dto/statistics-per-profile-dropped-queue-ratio.dto';
import { PerProfileMeanCallDurationDTO } from '../../model/statistics/dto/statistics-per-profile-mean-call-duration.dto';
import { PerProfileMeanQueueDurationDTO } from '../../model/statistics/dto/statistics-per-profile-mean-queue-duration.dto';
import { PerProfileRateReviewStatsDTO } from '../../model/statistics/dto/statistics-per-profile-rate-review-stats.dto';
import { QueueCountDTO } from '../../model/statistics/dto/statistics-queue-count.dto';
import { TotalCallCountDTO } from '../../model/statistics/dto/statistics-total-call-count.dto';
import { TotalCallDurationDTO } from '../../model/statistics/dto/statistics-total-call-duration.dto';
import { RANGE } from '../../model/statistics/range.enum';
import { PerProfileCallCountRESP } from '../../model/statistics/response/statistics-per-profile-call-count.response';
import { PerProfileCallDurationRESP } from '../../model/statistics/response/statistics-per-profile-call-duration.response';
import { PerProfileDroppedQueueRatioRESP } from '../../model/statistics/response/statistics-per-profile-dropped-queue-ratio.response';
import { PerProfileMeanCallDurationRESP } from '../../model/statistics/response/statistics-per-profile-mean-call-duration.response';
import { PerProfileMeanQueueDurationRESP } from '../../model/statistics/response/statistics-per-profile-mean-queue-duration.response';
import { PerProfileRateReviewStatsRESP } from '../../model/statistics/response/statistics-per-profile-rate-review-stats.response';
import { QueueCountRESP } from '../../model/statistics/response/statistics-queue-count.response';
import { TotalCallCountRESP } from '../../model/statistics/response/statistics-total-call-count.response';
import { TotalCallDurationRESP } from '../../model/statistics/response/statistics-total-call-duration.response';

export const fetchTotalCallCountStats = async (range: RANGE) => {
    try {
        const data = (await destineeApi.get<TotalCallCountRESP[]>(`/statistics/total-call-count?range=${range}`)).data;
        return {
            totalCallCount: data.map((call) => ({
                id: call._id,
                callCount: call.callCount,
            } as TotalCallCountDTO)),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê số lượng cuộc gọi');
    }
};

export const fetchPerProfileCallCountStats = async (range: RANGE) => {
    try {
        const data = (await destineeApi.get<PerProfileCallCountRESP[]>(`/statistics/per-profile-call-count?range=${range}`)).data;
        return {
            perProfileCallCount: data.map((call) => {
                return {
                    id: call._id,
                    callCount: call.callCount,
                    profileCount: call.profileCount,
                } as PerProfileCallCountDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê trung bình số cuộc gọi');
    }
};

export const fetchTotalCallDurationStats = async (range: RANGE) => {
    try {
        const data = (await destineeApi.get<TotalCallDurationRESP[]>(`/statistics/total-call-duration?range=${range}`)).data;
        return {
            totalCallDuration: data.map((duration) => {
                return {
                    id: duration._id,
                    callDuration: duration.callDuration,
                } as TotalCallDurationDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê tổng thời lượng cuộc gọi');
    }
};

export const fetchPerProfileCallDurationStats = async (range: RANGE) => {
    try {
        const data = (await destineeApi.get<PerProfileCallDurationRESP[]>(`/statistics/per-profile-call-duration?range=${range}`))
            .data;
        return {
            perProfileCallDuration: data.map((duration) => {
                return {
                    id: duration._id,
                    callDuration: duration.callDuration,
                    profileCount: duration.profileCount,
                } as PerProfileCallDurationDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê trung bình thời lượng cuộc gọi');
    }
};

export const fetchPerProfileMeanCallDurationStats = async (range: RANGE) => {
    try {
        const data = (
            await destineeApi.get<PerProfileMeanCallDurationRESP[]>(`/statistics/per-profile-mean-call-duration?range=${range}`)
        ).data;
        return {
            perProfileMeanCallDuration: data.map((duration) => {
                return {
                    id: duration._id,
                    meanCallDuration: duration.meanCallDuration,
                    profileCount: duration.profileCount,
                } as PerProfileMeanCallDurationDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê trung bình thời lượng một cuộc gọi');
    }
};

export const fetchQueueCountStats = async (range: RANGE) => {
    try {
        const data = (await destineeApi.get<QueueCountRESP[]>(`/statistics/queue-count?range=${range}`)).data;
        return {
            queueCount: data.map((queue) => {
                return {
                    id: queue._id,
                    queueCount: queue.queueCount,
                    succeededQueueCount: queue.succeededQueueCount,
                    droppedQueueCount: queue.droppedQueueCount,
                } as QueueCountDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê số lần tham gia hàng chờ');
    }
};

export const fetchPerProfileMeanQueueDurationStats = async (range: RANGE) => {
    try {
        const data = (
            await destineeApi.get<PerProfileMeanQueueDurationRESP[]>(`/statistics/per-profile-mean-queue-duration?range=${range}`)
        ).data;
        return {
            perProfileMeanQueueDuration: data.map((queue) => {
                return {
                    id: queue._id,
                    meanQueueDuration: queue.meanQueueDuration,
                    meanSucceededQueueDuration: queue.meanSucceededQueueDuration,
                    meanDroppedQueueDuration: queue.meanDroppedQueueDuration,
                    profileCount: queue.profileCount,
                } as PerProfileMeanQueueDurationDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê trung bình thời lượng hàng chờ');
    }
};

export const fetchPerProfileDroppedQueueRatioStats = async (range: RANGE) => {
    try {
        const data = (
            await destineeApi.get<PerProfileDroppedQueueRatioRESP[]>(`/statistics/per-profile-dropped-queue-ratio?range=${range}`)
        ).data;
        return {
            perProfileDroppedRatio: data.map((ratio) => {
                return {
                    id: ratio._id,
                    droppedQueueRatio: ratio.droppedQueueRatio,
                    profileCount: ratio.profileCount,
                } as PerProfileDroppedQueueRatioDTO;
            }),
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê tỉ lệ rời hàng chờ');
    }
};

export const fetchPerProfileRateReviewStats = async () => {
    try {
        const data = (
            await destineeApi.get<PerProfileRateReviewStatsRESP>(`/statistics/per-profile-rate-review-stats`)
        ).data;
        return {
           perProfileMeanCallRates : data.perProfileMeanCallRates,
           reviewsCount: data.reviewsCount
        } as PerProfileRateReviewStatsDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thống kê đánh giá sau cuộc gọi');
    }
};