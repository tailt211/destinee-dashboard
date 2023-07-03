import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { auth } from '../../firebase';
import { destineeApi } from '../../https';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { fetchMyAccount } from '../account/account.service';
import { resetState as resetAccountState } from '../account/account.slice';
import { resetState as resetAuthState } from '../auth/auth.slice';
import { resetState as resetProfileState } from '../profile/profile.slice';
import { clearLocalStorageToken, loginFirebase, setLocalStorageToken } from './auth.service';

export const loginThunk = createAsyncThunk<void, { email: string; password: string }, { rejectValue: string }>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            await loginFirebase(email, password);
        } catch (err: any) {
            console.log(err);
            return rejectWithValue(err.message);
        }
    },
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    await auth.signOut();
    clearLocalStorageToken();

    dispatch(resetAuthState());
    dispatch(resetAccountState());
    dispatch(resetProfileState());
});

export const setTokenThunk = createAsyncThunk<{ token: string; tokenExpiresTime: number }, User, { rejectValue: string }>(
    'auth/set-token',
    async (userAuth, { rejectWithValue, dispatch }) => {
        try {
            const tokenResult = await userAuth?.getIdTokenResult(true);
            const token = tokenResult?.token!;
            const expiresTime = Date.parse(tokenResult?.expirationTime!);
            setLocalStorageToken(token, expiresTime);
            destineeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            dispatch(fetchMyAccountThunk());
            return { token, tokenExpiresTime: expiresTime };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchMyAccountThunk = createAsyncThunk<AccountDTO, undefined, { rejectValue: string }>(
    'auth/fetch-my-account',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchMyAccount();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const refreshTokenThunk = createAsyncThunk<{ token: string; tokenExpiresTime: number }, User, { rejectValue: string }>(
    'auth/refresh-token',
    async (userAuth, { rejectWithValue }) => {
        try {
            console.warn('Token is expired, Refreshing token');
            const tokenResult = await userAuth?.getIdTokenResult(true);
            const token = tokenResult?.token!;
            const expiresTime = Date.parse(tokenResult?.expirationTime!);

            setLocalStorageToken(token, expiresTime);
            destineeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, tokenExpiresTime: expiresTime };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
