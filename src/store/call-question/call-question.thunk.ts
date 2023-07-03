import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallQuestionQueryFilter } from '../../model/call-question/call-question-query-filter';
import { CallQuestionOverallDTO } from '../../model/call-question/dto/call-question-overall.dto';
import { Answer as CallQuestionAnswerDTO, CallQuestionDTO } from '../../model/call-question/dto/call-question.dto';
import { CallQuestionAnswerCreateREQ } from '../../model/call-question/request/call-question-answer-create.request';
import { CallQuestionAnswerUpdateREQ } from '../../model/call-question/request/call-question-answer-update.request';
import { CallQuestionCreateREQ } from '../../model/call-question/request/call-question-create.request';
import { CallQuestionUpdateDisabledREQ } from '../../model/call-question/request/call-question-update-disabled.request';
import { CallQuestionUpdateREQ } from '../../model/call-question/request/call-question-update.request';
import {
    createCallQuestion,
    createCallQuestionAnswer,
    deleteCallQuestionAnswer,
    fetchCallQuestion,
    fetchCallQuestions,
    updateCallQuestion,
    updateCallQuestionAnswer,
    updateCallQuestionDisabled,
} from './call-question.service';

export const fetchCallQuestionsThunk = createAsyncThunk<
    { questions: CallQuestionOverallDTO[]; totalPage: number; page: number; queryFilter: CallQuestionQueryFilter },
    CallQuestionQueryFilter,
    { rejectValue: string }
>('call-question/fetch-questions', async (queryFilter, { rejectWithValue }) => {
    try {
        const { search, page, limit, orderBy, sortBy, disabled } = queryFilter;
        const result = await fetchCallQuestions(limit, page, orderBy, sortBy, search, disabled);
        return { ...result, queryFilter };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchCallQuestionThunk = createAsyncThunk<CallQuestionDTO, string, { rejectValue: string }>(
    'call-question/fetch-question',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCallQuestion(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const createCallQuestionThunk = createAsyncThunk<
    CallQuestionOverallDTO,
    { body: CallQuestionCreateREQ },
    { rejectValue: string }
>('call-question/create-question', async ({ body }, { rejectWithValue }) => {
    try {
        return await createCallQuestion(body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateCallQuestionThunk = createAsyncThunk<
    { id: string; title: string },
    { id: string; body: CallQuestionUpdateREQ },
    { rejectValue: string }
>('call-question/update-question', async ({ id, body }, { rejectWithValue }) => {
    try {
        await updateCallQuestion(id, body);
        return { id, title: body.title };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateCallQuestionDisabledThunk = createAsyncThunk<
    string,
    { id: string; body: CallQuestionUpdateDisabledREQ },
    { rejectValue: string }
>('call-question/update-question-disabled', async ({ id, body }, { rejectWithValue }) => {
    try {
        await updateCallQuestionDisabled(id, body);
        return id;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

/* Answer */
export const createCallQuestionAnswerThunk = createAsyncThunk<
    CallQuestionAnswerDTO,
    { id: string; body: CallQuestionAnswerCreateREQ; index: number },
    { rejectValue: string }
>('call-question/create-answer', async ({ id, body }, { rejectWithValue }) => {
    try {
        return await createCallQuestionAnswer(id, body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateCallQuestionAnswerThunk = createAsyncThunk<
    string,
    { id: string; answerId: string; body: CallQuestionAnswerUpdateREQ; index: number },
    { rejectValue: string }
>('call-question/update-answer', async ({ id, answerId, body }, { rejectWithValue }) => {
    try {
        await updateCallQuestionAnswer(id, answerId, body);
        return body.title;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const deleteCallQuestionAnswerThunk = createAsyncThunk<
    void,
    { id: string; answerId: string; index: number },
    { rejectValue: string }
>('call-question/delete-answer', async ({ id, answerId }, { rejectWithValue }) => {
    try {
        return await deleteCallQuestionAnswer(id, answerId);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});
