import { createAsyncThunk } from '@reduxjs/toolkit';
import { MbtiTestDetailDTO } from '../../model/mbti-test/dto/mbti-test-detail.dto';
import { MbtiTestOverallDTO } from '../../model/mbti-test/dto/mbti-test-overall.dto';
import { MbtiTestQueryFilter } from '../../model/mbti-test/mbti-test-query-filter';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { fetchSearchProfiles } from '../profile/profile.service';
import { fetchMbtiTest, fetchMbtiTests } from './mbti-test.service';

export const fetchMbtiTestsThunk = createAsyncThunk<
    { mbtiTests: MbtiTestOverallDTO[]; totalPage: number; page: number; queryFilter: MbtiTestQueryFilter },
    MbtiTestQueryFilter,
    { rejectValue: string }
>('mbti-test/fetch-mbti-tests', async (queryFilter, { rejectWithValue }) => {
    try {
        const { limit, page, orderBy, sortBy, owner, mbtiType, processingState } = queryFilter;
        const result = await fetchMbtiTests(limit, page, orderBy, sortBy, owner, mbtiType, processingState);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchMbtiTestThunk = createAsyncThunk<MbtiTestDetailDTO, string, { rejectValue: string }>(
    'mbti-test/fetch-mbti-test',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchMbtiTest(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchSearchProfilesThunk = createAsyncThunk<ProfileSearchDTO[], string, { rejectValue: string }>(
    'mbti-test/fetch-search-profiles',
    async (search, { rejectWithValue }) => {
        try {
            return await fetchSearchProfiles(search);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
