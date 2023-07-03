import { createAsyncThunk } from '@reduxjs/toolkit';
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
import {
    fetchPerProfileCallCountStats,
    fetchPerProfileCallDurationStats,
    fetchPerProfileDroppedQueueRatioStats,
    fetchPerProfileMeanCallDurationStats,
    fetchPerProfileMeanQueueDurationStats,
    fetchPerProfileRateReviewStats,
    fetchQueueCountStats,
    fetchTotalCallCountStats,
    fetchTotalCallDurationStats,
} from './statistics.service';

export const fetchTotalCallCountStatsThunk = createAsyncThunk<{ totalCallCount: TotalCallCountDTO[] }, RANGE, { rejectValue: string }>(
    'statistics/fetch-total-call-count',
    async (range, { rejectWithValue }) => {
        try {
            return await fetchTotalCallCountStats(range);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchPerProfileCallCountStatsThunk = createAsyncThunk<
    { perProfileCallCount: PerProfileCallCountDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-per-profile-call-count', async (range, { rejectWithValue }) => {
    try {
        return await fetchPerProfileCallCountStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchTotalCallDurationStatsThunk = createAsyncThunk<
    { totalCallDuration: TotalCallDurationDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-total-call-duration', async (range, { rejectWithValue }) => {
    try {
        return await fetchTotalCallDurationStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchPerProfileCallDurationStatsThunk = createAsyncThunk<
    { perProfileCallDuration: PerProfileCallDurationDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-per-profile-call-duration', async (range, { rejectWithValue }) => {
    try {
        return await fetchPerProfileCallDurationStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchPerProfileMeanCallDurationStatsThunk = createAsyncThunk<
    { perProfileMeanCallDuration: PerProfileMeanCallDurationDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-per-profile-mean-call-duration', async (range, { rejectWithValue }) => {
    try {
        return await fetchPerProfileMeanCallDurationStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchQueueCountStatsThunk = createAsyncThunk<{ queueCount: QueueCountDTO[] }, RANGE, { rejectValue: string }>(
    'statistics/fetch-queue-count',
    async (range, { rejectWithValue }) => {
        try {
            return await fetchQueueCountStats(range);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchPerProfileMeanQueueDurationStatsThunk = createAsyncThunk<
    { perProfileMeanQueueDuration: PerProfileMeanQueueDurationDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-per-profile-mean-queue-duration', async (range, { rejectWithValue }) => {
    try {
        return await fetchPerProfileMeanQueueDurationStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchPerProfileDroppedQueueRatioStatsThunk = createAsyncThunk<
    { perProfileDroppedRatio: PerProfileDroppedQueueRatioDTO[] },
    RANGE,
    { rejectValue: string }
>('statistics/fetch-per-profile-dropped-queue-ratio', async (range, { rejectWithValue }) => {
    try {
        return await fetchPerProfileDroppedQueueRatioStats(range);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchPerProfileRateReviewStatsThunk = createAsyncThunk<
    PerProfileRateReviewStatsDTO,
    undefined,
    { rejectValue: string }
>('statistics/fetch-per-profile-rate-review-stats', async (_, { rejectWithValue }) => {
    try {
        return await fetchPerProfileRateReviewStats();
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});
