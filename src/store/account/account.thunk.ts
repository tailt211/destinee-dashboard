import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { AccountQueryFilter } from '../../model/account/account-query-filter';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { AccountUpdateDisabledREQ } from '../../model/account/request/account-update-disabled.request';
import { AccountUpdatePasswordREQ } from '../../model/account/request/account-update-password.request';
import { AccountCreateREQ } from '../../model/account/request/account-create.request';
import { logoutThunk } from '../auth/auth.thunk';
import { changeAccountPassword, createAccount, fetchAccounts, updateAccountDisabled } from './account.service';

export const fetchAccountsThunk = createAsyncThunk<
    { accounts: AccountDTO[]; totalPage: number; page: number; queryFilter: AccountQueryFilter },
    AccountQueryFilter,
    { rejectValue: string }
>('account/fetch-all', async (queryFilter, { rejectWithValue }) => {
    try {
        const { search, page, limit, orderBy, sortBy, role, disabled } = queryFilter;
        const result = await fetchAccounts(limit, page, orderBy, sortBy, search, role, disabled);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const changeAccountPasswordThunk = createAsyncThunk<{}, { id: string; body: AccountUpdatePasswordREQ }, { rejectValue: string }>(
    'account/change-password',
    async ({ id, body }, { rejectWithValue, getState, dispatch }) => {
        try {
            const { myAccount } = (getState() as RootState).auth;
            await changeAccountPassword(id, body);
            if (myAccount?.id === id) dispatch(logoutThunk());
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateAccountDisabledThunk = createAsyncThunk<
    string,
    { id: string; body: AccountUpdateDisabledREQ },
    { rejectValue: string }
>('account/update-disabled', async ({ id, body }, { rejectWithValue }) => {
    try {
        return await updateAccountDisabled(id, body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createAccountThunk = createAsyncThunk<AccountDTO, AccountCreateREQ, { rejectValue: string }>(
    'account/create',
    async (body, { rejectWithValue, dispatch }) => {
        try {
            const createdAccount = await createAccount(body);
            dispatch(fetchAccountsThunk({}));
            return createdAccount;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
