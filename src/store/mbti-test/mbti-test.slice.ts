import { createSlice } from '@reduxjs/toolkit';
import { MbtiTestDetailDTO } from '../../model/mbti-test/dto/mbti-test-detail.dto';
import { MbtiTestOverallDTO } from '../../model/mbti-test/dto/mbti-test-overall.dto';
import { MbtiTestQueryFilter } from '../../model/mbti-test/mbti-test-query-filter';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { RejectedAction } from '../store-type';
import { fetchMbtiTestsThunk, fetchMbtiTestThunk, fetchSearchProfilesThunk } from './mbti-test.thunk';

export interface MbtiTestState {
    loading: boolean;
    drawerLoading: boolean;
    searchLoading: boolean;
    error?: string;
    currentPage: number;
    totalPage: number;
    mbtiTests: MbtiTestOverallDTO[];
    mbtiTest?: MbtiTestDetailDTO;
    queryFilter: MbtiTestQueryFilter;
    searchProfiles: ProfileSearchDTO[];
}

export const initialQueryFilter = {
    page: 1,
    limit: 15,
    orderBy: ORDER_BY.DESC,
    sortBy: 'createdAt',
} as MbtiTestQueryFilter;

const initialState: MbtiTestState = {
    loading: true,
    drawerLoading: true,
    searchLoading: false,
    mbtiTests: [],
    currentPage: 1,
    totalPage: 1,
    queryFilter: initialQueryFilter,
    searchProfiles: [],
};

const mbtiTestSlice = createSlice({
    name: 'mbti-test',
    initialState: initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetDrawer: (state) => {
            state.mbtiTest = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchMbtiTestsThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchMbtiTestsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.mbtiTests = payload.mbtiTests;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchMbtiTestThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchMbtiTestThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.mbtiTest = payload;
        }),
        builder.addCase(fetchSearchProfilesThunk.pending, (state) => {
            state.searchLoading = true;
        }),
        builder.addCase(fetchSearchProfilesThunk.fulfilled, (state, { payload }) => {
            state.searchLoading = false;
            state.searchProfiles = payload;
        }),
        // builder.addMatcher(
        //     (action): action is PendingAction => action.type.startsWith('mbti-test/') && action.type.endsWith('/pending'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('mbti-test/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.drawerLoading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetDrawer, resetState } = mbtiTestSlice.actions;

export default mbtiTestSlice.reducer;
