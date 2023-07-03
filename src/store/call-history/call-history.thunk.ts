import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallHistoryQueryFilter } from '../../model/call-history/call-history-query-filter';
import { CallHistoryDetailDTO } from '../../model/call-history/dto/call-history-detail.dto';
import { CallHistoryOverallDTO } from '../../model/call-history/dto/call-history-overall.dto';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { fetchSearchProfiles } from '../profile/profile.service';
import { fetchCallHistories, fetchCallHistory } from './call-history.service';

export const fetchCallHistoriesThunk = createAsyncThunk<
    { callHistories: CallHistoryOverallDTO[]; totalPage: number; page: number; queryFilter: CallHistoryQueryFilter },
    CallHistoryQueryFilter,
    { rejectValue: string }
>('call-history/fetch-call-histories', async (queryFilter, { rejectWithValue }) => {
    try {
        const { limit, page, orderBy, sortBy, participants, endReason } = queryFilter;
        const result = await fetchCallHistories(limit, page, orderBy, sortBy, participants, endReason);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchCallHistoryThunk = createAsyncThunk<CallHistoryDetailDTO, string, { rejectValue: string }>(
    'call-history/fetch-call-history',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCallHistory(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchSearchProfilesThunk = createAsyncThunk<ProfileSearchDTO[], string, { rejectValue: string }>(
    'call-history/fetch-search-profiles',
    async (search, { rejectWithValue }) => {
        try {
            return await fetchSearchProfiles(search);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
