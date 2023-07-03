import { createSlice } from '@reduxjs/toolkit';
import { AccountQueryFilter } from '../../model/account/account-query-filter';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { ORDER_BY } from '../../model/order-by.enum';
import { RejectedAction } from '../store-type';
import {
    changeAccountPasswordThunk,
    createAccountThunk,
    fetchAccountsThunk,
    updateAccountDisabledThunk,
} from './account.thunk';

export type AccountState = {
    loading: boolean;
    isSubmitting?: boolean;
    error?: string;
    currentPage: number;
    accounts: AccountDTO[];
    isupdate?: boolean;
    totalPage: number;
    firebaseError?: string;
    queryFilter: AccountQueryFilter;
};

export const initialQueryFilter = { orderBy: ORDER_BY.DESC, sortBy: 'createdAt', limit: 15, page: 1 } as AccountQueryFilter;
export const initialState: AccountState = {
    loading: true,
    currentPage: 1,
    accounts: [],
    totalPage: 1,
    queryFilter: initialQueryFilter,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
            state.firebaseError = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchAccountsThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchAccountsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.accounts = payload.accounts;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        /* Password Change */
        builder.addCase(changeAccountPasswordThunk.pending, (state) => {
            state.isSubmitting = true;
        }),
        builder.addCase(changeAccountPasswordThunk.fulfilled, (state) => {
            state.isSubmitting = false;
        }),
        builder.addCase(updateAccountDisabledThunk.pending, (state) => {
            state.isSubmitting = true;
        }),
        builder.addCase(updateAccountDisabledThunk.fulfilled, (state, { payload }) => {
            state.isSubmitting = false;
            const index = state.accounts.findIndex((account) => account.id === payload);
            if (index > -1) state.accounts[index].disabled = !state.accounts[index].disabled;
        }),
        builder.addCase(createAccountThunk.pending, (state) => {
            state.isSubmitting = true;
        }),
        builder.addCase(createAccountThunk.fulfilled, (state) => {
            state.isSubmitting = false;
            state.firebaseError = undefined;
        }),
        builder.addCase(createAccountThunk.rejected, (state, { payload }) => {
            state.isSubmitting = false;
            state.firebaseError = payload! as string;
        }),
        // builder.addMatcher(
        //     (action): action is PendingAction =>
        //         action.type.startsWith('account/') &&
        //         action.type.endsWith('/pending') &&
        //         !action.type.includes('change-password') &&
        //         !action.type.includes('update-disabled'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('account/') && action.type.endsWith('/rejected') && !action.type.includes('create'),
            (state, { payload }) => {
                state.loading = false;
                state.isSubmitting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = accountSlice.actions;

export default accountSlice.reducer;
