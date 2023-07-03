import { createSlice } from '@reduxjs/toolkit';
import { CallQuestionQueryFilter } from '../../model/call-question/call-question-query-filter';
import { CallQuestionOverallDTO } from '../../model/call-question/dto/call-question-overall.dto';
import { CallQuestionDTO } from '../../model/call-question/dto/call-question.dto';
import { ORDER_BY } from '../../model/order-by.enum';
import { PendingAction, RejectedAction } from '../store-type';
import {
    createCallQuestionAnswerThunk,
    createCallQuestionThunk,
    deleteCallQuestionAnswerThunk,
    fetchCallQuestionsThunk,
    fetchCallQuestionThunk,
    updateCallQuestionAnswerThunk,
    updateCallQuestionDisabledThunk,
    updateCallQuestionThunk,
} from './call-question.thunk';

export interface CallQuestionState {
    loading: boolean;
    drawerLoading: boolean;
    isSubmitting: boolean;
    error?: string;
    totalPage: number;
    currentPage: number;
    questions: CallQuestionOverallDTO[];
    question?: CallQuestionDTO;
    answerSubmitting: boolean[]; // chứa index of answer, -1 = creating
    queryFilter: CallQuestionQueryFilter;
}

export const initialQueryFilter = { orderBy: ORDER_BY.DESC, sortBy: 'createdAt', limit: 15, page: 1 } as CallQuestionQueryFilter;
export const initialState: CallQuestionState = {
    loading: false,
    drawerLoading: false,
    isSubmitting: false,
    totalPage: 1,
    currentPage: 1,
    questions: [],
    answerSubmitting: [],
    queryFilter: initialQueryFilter
};

export const callQuestionSlice = createSlice({
    name: 'call-question',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
        resetDrawer: (state) => {
            state.drawerLoading = false;
            state.isSubmitting = false;
            state.answerSubmitting = [];
            state.question = undefined;
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchCallQuestionsThunk.pending, (state, { payload }) => {
            state.loading = true;
        }),
        builder.addCase(fetchCallQuestionsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.currentPage = payload.page;
            state.questions = payload.questions;
            state.totalPage = payload.totalPage;
            state.queryFilter = payload.queryFilter;
        }),
        builder.addCase(fetchCallQuestionThunk.pending, (state, { payload }) => {
            state.drawerLoading = true;
        }),
        builder.addCase(fetchCallQuestionThunk.fulfilled, (state, { payload }) => {
            state.drawerLoading = false;
            state.question = payload;
            state.error = undefined;
        }),
        builder.addCase(createCallQuestionThunk.fulfilled, (state, { payload }) => {
            state.isSubmitting = false;
            state.error = undefined;
            state.questions.unshift(payload);
        }),
        builder.addCase(updateCallQuestionThunk.fulfilled, (state, { payload }) => {
            state.isSubmitting = false;
            if (state.question) state.question.title = payload.title;
            const question = state.questions.find((question) => question.id === payload.id);
            if (question) question.title = payload.title;
        }),
        builder.addCase(updateCallQuestionDisabledThunk.fulfilled, (state, { payload }) => {
            state.isSubmitting = false;
            if (state.question) state.question.disabled = !state.question.disabled;
            const question = state.questions.find((question) => question.id === payload);
            if (question) question.disabled = !question.disabled;
        }),
        builder.addCase(createCallQuestionAnswerThunk.pending, (state, { meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = true;
        }),
        builder.addCase(createCallQuestionAnswerThunk.fulfilled, (state, { payload, meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = false;
            state.question.answers.push(payload);
        }),
        builder.addCase(updateCallQuestionAnswerThunk.pending, (state, { meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = true;
        }),
        builder.addCase(updateCallQuestionAnswerThunk.fulfilled, (state, { payload, meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = false;
            state.question.answers[meta.arg.index].title = payload;
        }),
        builder.addCase(updateCallQuestionAnswerThunk.rejected, (state, { payload, meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = false;
            state.error = `Đã có thay đổi bởi ai đó, vui lòng tải lại để tránh xung đột`;
        }),
        builder.addCase(deleteCallQuestionAnswerThunk.pending, (state, { meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = true;
        }),
        builder.addCase(deleteCallQuestionAnswerThunk.fulfilled, (state, { meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = false;
            state.question.answers.splice(meta.arg.index, 1);
        }),
        builder.addCase(deleteCallQuestionAnswerThunk.rejected, (state, { meta }) => {
            if (!state.question) return;
            state.answerSubmitting[meta.arg.index] = false;
            state.error = `Không thể xoá vì tối thiểu phải có ${process.env.REACT_APP_CALL_QUESTION_ANSWER_MIN} câu trả lời`;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('call-question/') &&
                action.type.endsWith('/pending') &&
                (action.type.includes('create-question') ||
                    action.type.includes('update-question') ||
                    action.type.includes('update-question-disabled')),
            (state, action) => {
                state.isSubmitting = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('call-question/') &&
                action.type.endsWith('/rejected') &&
                action.type.includes('update-answer') &&
                action.type.includes('delete-answer'),
            (state, { payload }) => {
                state.loading = false;
                state.isSubmitting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState, resetDrawer } = callQuestionSlice.actions;

export default callQuestionSlice.reducer;
