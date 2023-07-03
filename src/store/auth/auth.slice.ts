import { createSlice } from '@reduxjs/toolkit';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { ALLOWED_ROLES } from '../../model/account/roles.enum';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchMyAccountThunk, loginThunk, logoutThunk, refreshTokenThunk, setTokenThunk } from './auth.thunk';

export interface AuthState {
    loading: boolean;
    error?: string;
    isLoggingIn: boolean;
    token?: string;
    tokenExpiresTime?: number;
    myAccount?: AccountDTO;
    isAllowed?: boolean;
}

export const initialState: AuthState = {
    loading: true,
    isLoggingIn: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(loginThunk.pending, (state) => {
            state.isLoggingIn = true;
        }),
        builder.addCase(loginThunk.fulfilled, (state) => {
            state.isLoggingIn = false;
            state.error = undefined;
        }),
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.loading = false;
        }),
        builder.addCase(setTokenThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.token = payload.token;
            state.tokenExpiresTime = payload.tokenExpiresTime;
            state.error = undefined;
        }),
        builder.addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.token = payload.token;
            state.tokenExpiresTime = payload.tokenExpiresTime;
            state.error = undefined;
        }),
        builder.addCase(fetchMyAccountThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.myAccount = payload;
            state.isAllowed = ALLOWED_ROLES.includes(payload.role);
        }),
        builder.addMatcher(
            (action): action is PendingAction => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.isLoggingIn = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = authSlice.actions;

export default authSlice.reducer;
