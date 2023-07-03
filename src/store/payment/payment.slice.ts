import { createSlice } from '@reduxjs/toolkit';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaymentDetailDTO } from '../../model/payment/dto/payment-detail.dto';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { PaymentQueryFilter } from '../../model/payment/payment-query-filter';
import { RejectedAction } from '../store-type';
import { fetchPaymentsThunk, fetchPaymentThunk } from './payment.thunk';

export interface PaymentState {
    loading: boolean;
    drawerLoading: boolean;
    error?: string;
    currentPage: number;
    totalPage: number;
    payments: PaymentDTO[];
    payment?: PaymentDetailDTO;
    queryFilter: PaymentQueryFilter;
}

export const initialQueryFilter = {
    page: 1,
    limit: 15,
    orderBy: ORDER_BY.DESC,
    sortBy: 'createdAt',
} as PaymentQueryFilter;

const initialState: PaymentState = {
    loading: true,
    drawerLoading: true,
    payments: [],
    currentPage: 1,
    totalPage: 1,
    queryFilter: initialQueryFilter,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState: initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetDrawer: (state) => {
            state.payment = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchPaymentsThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchPaymentsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.payments = payload.payments;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchPaymentThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchPaymentThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.payment = payload;
        }),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('payment/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.drawerLoading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, 
    resetDrawer, 
    resetState } = paymentSlice.actions;

export default paymentSlice.reducer;
