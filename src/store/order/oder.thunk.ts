import { createAsyncThunk } from '@reduxjs/toolkit';
import { OrderDetailDTO } from '../../model/order/dto/order-detail.dto';
import { OrderDTO } from '../../model/order/dto/order.dto';
import { OrderQueryFilter } from '../../model/order/order-query-filter';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { fetchSearchProfiles } from '../profile/profile.service';
import { fetchOrder, fetchOrders } from './order.service';

export const fetchOrdersThunk = createAsyncThunk<
    { orders: OrderDTO[]; totalPage: number; page: number; queryFilter: OrderQueryFilter },
    OrderQueryFilter,
    { rejectValue: string }
>('order/fetch-orders', async (queryFilter, { rejectWithValue }) => {
    try {
        const { limit, page, orderBy, sortBy, owner, status } = queryFilter;
        const result = await fetchOrders(limit, page, orderBy, sortBy, owner, status);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchOrderThunk = createAsyncThunk<OrderDetailDTO, string, { rejectValue: string }>(
    'order/fetch-order',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchOrder(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchSearchProfilesThunk = createAsyncThunk<ProfileSearchDTO[], string, { rejectValue: string }>(
    'order/fetch-search-profiles',
    async (search, { rejectWithValue }) => {
        try {
            return await fetchSearchProfiles(search);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);