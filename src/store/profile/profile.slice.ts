import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { ProfileOverallDTO } from '../../model/profile/dto/profile-overall.dto';
import { ProfileQueryFilter } from '../../model/profile/profile-query-filter';
import { RejectedAction } from '../store-type';
import { fetchAccountThunk, fetchProfilesThunk, fetchProfileThunk } from './profile.thunk';

export type ProfileState = {
    loading: boolean;
    error?: string;
    profiles: ProfileOverallDTO[];
    currentPage: number;
    totalPage: number;
    profile?: ProfileDTO;
    drawerLoading: boolean;
    account?: AccountDTO;
    queryFilter: ProfileQueryFilter;
};

export const initialQueryFilter = { orderBy: ORDER_BY.DESC, sortBy: 'callCount', limit: 15, page: 1 } as ProfileQueryFilter;
export const initialState: ProfileState = {
    loading: true,
    profiles: [],
    currentPage: 1,
    totalPage: 1,
    drawerLoading: true,
    queryFilter: initialQueryFilter,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
        updateStatus: (state, { payload }: PayloadAction<{ accountId: string; disabled: boolean }>) => {
            const index = state.profiles.findIndex((profile) => profile.accountId === payload.accountId);
            if (index >= 0) state.profiles[index].disabled = payload.disabled;
            if (state.profile) state.profile.disabled = payload.disabled;
            if (state.account) state.account.disabled = payload.disabled;
        },
        resetProfileDrawer: (state) => {
            state.profile = undefined;
            state.drawerLoading = false;
        },
        resetAccountDrawer: (state) => {
            state.account = undefined;
            state.drawerLoading = false;
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchProfilesThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchProfilesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.profiles = payload.profiles;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchProfileThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchProfileThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.profile = payload;
        }),
        builder.addCase(fetchAccountThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchAccountThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.account = payload;
        }),
        // builder.addMatcher(
        //     (action): action is PendingAction => action.type.startsWith('profile/') && action.type.endsWith('/pending'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('profile/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.drawerLoading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState, updateStatus, resetProfileDrawer, resetAccountDrawer } = profileSlice.actions;

export default profileSlice.reducer;
