import { createSlice } from '@reduxjs/toolkit';
import { ORDER_BY } from '../../model/order-by.enum';
import { OrderDetailDTO } from '../../model/order/dto/order-detail.dto';
import { OrderDTO } from '../../model/order/dto/order.dto';
import { OrderQueryFilter } from '../../model/order/order-query-filter';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { RejectedAction } from '../store-type';
import { fetchOrdersThunk, fetchOrderThunk, fetchSearchProfilesThunk } from './oder.thunk';

export interface OrderState {
    loading: boolean;
    drawerLoading: boolean;
    searchLoading: boolean;
    error?: string;
    currentPage: number;
    totalPage: number;
    orders: OrderDTO[];
    order?: OrderDetailDTO;
    queryFilter: OrderQueryFilter;
    searchProfiles: ProfileSearchDTO[];
}

export const initialQueryFilter = {
    page: 1,
    limit: 15,
    orderBy: ORDER_BY.DESC,
    sortBy: 'createdAt',
} as OrderQueryFilter;

const initialState: OrderState = {
    loading: true,
    drawerLoading: true,
    searchLoading: false,
    orders: [],
    currentPage: 1,
    totalPage: 1,
    queryFilter: initialQueryFilter,
    searchProfiles: [],
};

const OrderSlice = createSlice({
    name: 'order',
    initialState: initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetDrawer: (state) => {
            state.order = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchOrdersThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchOrdersThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.orders = payload.orders;
            state.currentPage = payload.page;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchSearchProfilesThunk.pending, (state) => {
            state.searchLoading = true;
        }),
        builder.addCase(fetchOrderThunk.pending, (state) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchOrderThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.order = payload;
        }),
        builder.addCase(fetchSearchProfilesThunk.fulfilled, (state, { payload }) => {
            state.searchLoading = false;
            state.searchProfiles = payload;
        }),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('order/') && action.type.endsWith('/rejected'),
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
    resetState } = OrderSlice.actions;

export default OrderSlice.reducer;
