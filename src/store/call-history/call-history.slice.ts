import { createSlice } from '@reduxjs/toolkit';
import { CallHistoryQueryFilter } from '../../model/call-history/call-history-query-filter';
import { CallHistoryDetailDTO } from '../../model/call-history/dto/call-history-detail.dto';
import { CallHistoryOverallDTO } from '../../model/call-history/dto/call-history-overall.dto';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { RejectedAction } from '../store-type';
import { fetchCallHistoriesThunk, fetchCallHistoryThunk, fetchSearchProfilesThunk } from './call-history.thunk';

export interface CallHistoryState {
    loading: boolean;
    drawerLoading: boolean;
    searchLoading: boolean;
    error?: string;
    currentPage: number;
    totalPage: number;
    callHistories: CallHistoryOverallDTO[];
    callHistory?: CallHistoryDetailDTO;
    queryFilter: CallHistoryQueryFilter;
    searchProfiles: ProfileSearchDTO[];
}

export const initialQueryFilter = {
    page: 1,
    limit: 15,
    orderBy: ORDER_BY.DESC,
    sortBy: 'createdAt',
} as CallHistoryQueryFilter;

const initialState: CallHistoryState = {
    loading: true,
    drawerLoading: true,
    searchLoading: false,
    callHistories: [],
    currentPage: 1,
    totalPage: 1,
    queryFilter: initialQueryFilter,
    searchProfiles: [],
};

const callHistorySlice = createSlice({
    name: 'call-history',
    initialState: initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetDrawer: (state) => {
            state.callHistory = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchCallHistoriesThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchCallHistoriesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.callHistories = payload.callHistories;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchCallHistoryThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchCallHistoryThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.callHistory = payload;
        }),
        builder.addCase(fetchSearchProfilesThunk.pending, (state) => {
            state.searchLoading = true;
        }),
        builder.addCase(fetchSearchProfilesThunk.fulfilled, (state, { payload }) => {
            state.searchLoading = false;
            state.searchProfiles = payload;
        }),
        // builder.addMatcher(
        //     (action): action is PendingAction => action.type.startsWith('call-history/') && action.type.endsWith('/pending'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('call-history/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.drawerLoading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetDrawer, resetState } = callHistorySlice.actions;

export default callHistorySlice.reducer;
