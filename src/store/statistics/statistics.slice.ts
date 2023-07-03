import { createSlice } from '@reduxjs/toolkit';
import { PerProfileCallCountDTO } from '../../model/statistics/dto/statistics-per-profile-call-count.dto';
import { PerProfileCallDurationDTO } from '../../model/statistics/dto/statistics-per-profile-call-duration.dto';
import { PerProfileDroppedQueueRatioDTO } from '../../model/statistics/dto/statistics-per-profile-dropped-queue-ratio.dto';
import { PerProfileMeanCallDurationDTO } from '../../model/statistics/dto/statistics-per-profile-mean-call-duration.dto';
import { PerProfileMeanQueueDurationDTO } from '../../model/statistics/dto/statistics-per-profile-mean-queue-duration.dto';
import { PerProfileRateReviewStatsDTO } from '../../model/statistics/dto/statistics-per-profile-rate-review-stats.dto';
import { QueueCountDTO } from '../../model/statistics/dto/statistics-queue-count.dto';
import { TotalCallCountDTO } from '../../model/statistics/dto/statistics-total-call-count.dto';
import { TotalCallDurationDTO } from '../../model/statistics/dto/statistics-total-call-duration.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchPerProfileCallCountStatsThunk, fetchPerProfileCallDurationStatsThunk, fetchPerProfileDroppedQueueRatioStatsThunk, fetchPerProfileMeanCallDurationStatsThunk, fetchPerProfileMeanQueueDurationStatsThunk, fetchPerProfileRateReviewStatsThunk, fetchQueueCountStatsThunk, fetchTotalCallCountStatsThunk, fetchTotalCallDurationStatsThunk } from './statistics.thunk';

export type StatisticState = {
    loading: boolean;
    error?: string;
    totalCallCount: TotalCallCountDTO[];
    perProfileCallCount: PerProfileCallCountDTO[];
    totalCallDuration: TotalCallDurationDTO[];
    perProfileCallDuration: PerProfileCallDurationDTO[];
    perProfileMeanCallDuration: PerProfileMeanCallDurationDTO[];
    queueCount: QueueCountDTO[];
    perProfileMeanQueueDuration: PerProfileMeanQueueDurationDTO[];
    perProfileDroppedRatio: PerProfileDroppedQueueRatioDTO[];
    perProfileRateReviewStats?: PerProfileRateReviewStatsDTO;
};

export const initialState: StatisticState = {
    loading: true,
    totalCallCount: [],
    perProfileCallCount: [],
    totalCallDuration: [],
    perProfileCallDuration: [],
    perProfileMeanCallDuration: [],
    queueCount: [],
    perProfileMeanQueueDuration: [],
    perProfileDroppedRatio: [],
};

export const statisticSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchTotalCallCountStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.totalCallCount = payload.totalCallCount;
        }),
        builder.addCase(fetchPerProfileCallCountStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileCallCount = payload.perProfileCallCount;
        }),
        builder.addCase(fetchTotalCallDurationStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.totalCallDuration = payload.totalCallDuration;
        }),
        builder.addCase(fetchPerProfileCallDurationStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileCallDuration = payload.perProfileCallDuration;
        }),
        builder.addCase(fetchPerProfileMeanCallDurationStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileMeanCallDuration = payload.perProfileMeanCallDuration;
        }),
        builder.addCase(fetchQueueCountStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.queueCount = payload.queueCount;
        }),
        builder.addCase(fetchPerProfileMeanQueueDurationStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileMeanQueueDuration = payload.perProfileMeanQueueDuration;
        }),
        builder.addCase(fetchPerProfileDroppedQueueRatioStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileDroppedRatio = payload.perProfileDroppedRatio;
        }),
        builder.addCase(fetchPerProfileRateReviewStatsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.perProfileRateReviewStats = payload;
        }),
        builder.addMatcher(
            (action): action is PendingAction => action.type.startsWith('statistics/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('statistics/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = statisticSlice.actions;

export default statisticSlice.reducer;
