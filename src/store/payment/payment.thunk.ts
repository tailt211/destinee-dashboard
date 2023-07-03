import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentDetailDTO } from '../../model/payment/dto/payment-detail.dto';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { PaymentQueryFilter } from '../../model/payment/payment-query-filter';
import { fetchPayment, fetchPayments } from './payment.service';

export const fetchPaymentsThunk = createAsyncThunk<
    { payments: PaymentDTO[]; totalPage: number; page: number; queryFilter: PaymentQueryFilter },
    PaymentQueryFilter,
    { rejectValue: string }
>('payment/fetch-payments', async (queryFilter, { rejectWithValue }) => {
    try {
        const { limit, page, orderBy, sortBy, status, gateway } = queryFilter;
        const result = await fetchPayments(limit, page, orderBy, sortBy, status, gateway);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchPaymentThunk = createAsyncThunk<PaymentDetailDTO, string, { rejectValue: string }>(
    'payment/fetch-payment',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchPayment(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);