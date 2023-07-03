import { createAsyncThunk } from '@reduxjs/toolkit';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { ProfileOverallDTO } from '../../model/profile/dto/profile-overall.dto';
import { ProfileQueryFilter } from '../../model/profile/profile-query-filter';
import { fetchAccount } from '../account/account.service';
import { fetchProfiles, fetchProfile } from './profile.service';

export const fetchProfilesThunk = createAsyncThunk<
    { profiles: ProfileOverallDTO[]; totalPage: number; page: number; queryFilter: ProfileQueryFilter },
    ProfileQueryFilter,
    { rejectValue: string }
>('profile/fetch-all', async (queryFilter, { rejectWithValue }) => {
    try {
        const { search, page, limit, orderBy, sortBy, disabled, mbtiType } = queryFilter;
        const result = await fetchProfiles(limit, page, orderBy, sortBy, search, disabled, mbtiType);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchProfileThunk = createAsyncThunk<ProfileDTO, string, { rejectValue: string }>(
    'profile/fetch-profile',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchProfile(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchAccountThunk = createAsyncThunk<
    AccountDTO,
    string,
    { rejectValue: string }
>('profile/fetch-account', async (id, { rejectWithValue }) => {
    try {
        return await fetchAccount(id);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});
