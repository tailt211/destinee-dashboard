import { httpExceptionConverter } from '../../exception/http-exception.converter';
import { destineeApi } from '../../https';
import { CallQuestionOverallDTO } from '../../model/call-question/dto/call-question-overall.dto';
import { Answer as CallQuestionAnswerDTO, CallQuestionDTO } from '../../model/call-question/dto/call-question.dto';
import { CallQuestionAnswerCreateREQ } from '../../model/call-question/request/call-question-answer-create.request';
import { CallQuestionAnswerUpdateREQ } from '../../model/call-question/request/call-question-answer-update.request';
import { CallQuestionCreateREQ } from '../../model/call-question/request/call-question-create.request';
import { CallQuestionUpdateDisabledREQ } from '../../model/call-question/request/call-question-update-disabled.request';
import { CallQuestionUpdateREQ } from '../../model/call-question/request/call-question-update.request';
import { CallQuestionAnswerCreateRESP } from '../../model/call-question/response/call-question-answer-create.response';
import { CallQuestionCreateRESP } from '../../model/call-question/response/call-question-create.response';
import { CallQuestionOverallRESP } from '../../model/call-question/response/call-question-overall.response';
import { CallQuestionRESP } from '../../model/call-question/response/call-question.response';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaginationRESP } from '../../model/pagination.response';

export const fetchCallQuestions = async (
    limit: number = 15,
    page: number = 1,
    orderBy: ORDER_BY = ORDER_BY.DESC,
    sortBy: string = 'createdAt',
    search?: string,
    disabled?: boolean,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<CallQuestionOverallRESP>>(`/call-questions`, {
                params: { limit, page, orderBy, sortBy, search, disabled },
            })
        ).data;
        return {
            questions: data.results.map((question) => {
                return {
                    id: question._id,
                    title: question.title,
                    answerCount: question.answerCount,
                    createdAt: question.createdAt,
                    disabled: question.disabled ? question.disabled : false,
                    viewCount: question.viewCount,
                } as CallQuestionOverallDTO;
            }),
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải câu hỏi');
    }
};

export const fetchCallQuestion = async (id: string) => {
    try {
        const data = (await destineeApi.get<CallQuestionRESP>(`/call-questions/${id}`)).data;
        return {
            id: data._id,
            title: data.title,
            answers: data.answers.map((item) => ({
                id: item._id,
                title: item.title,
                selectedCount: item.selectedCount,
            } as CallQuestionAnswerDTO)),
            createdAt: data.createdAt,
            disabled: data.disabled,
            viewCount: data.viewCount,
        } as CallQuestionDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải chi tiết câu hỏi');
    }
};

/* Question */
export const createCallQuestion = async (body: CallQuestionCreateREQ) => {
    try {
        const data = (await destineeApi.post<CallQuestionCreateRESP>(`/call-questions`, body)).data;
        return {
            id: data._id,
            title: data.title,
            answerCount: data.answers.length,
            viewCount: 0,
            disabled: data.disabled,
            createdAt: data.createdAt,
        } as CallQuestionOverallDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tạo câu hỏi');
    }
};

export const updateCallQuestion = async (id: string, body: CallQuestionUpdateREQ) => {
    try {
        await destineeApi.patch<void>(`/call-questions/${id}`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi cập nhật câu hỏi');
    }
};

export const updateCallQuestionDisabled = async (id: string, body: CallQuestionUpdateDisabledREQ) => {
    try {
        await destineeApi.patch<void>(`/call-questions/${id}/disable`, body);
    } catch (err) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi thay đổi trạng thái câu hỏi');
    }
};

/* Question-answer */
export const createCallQuestionAnswer = async (id: string, body: CallQuestionAnswerCreateREQ) => {
    try {
        const data = (await destineeApi.post<CallQuestionAnswerCreateRESP>(`/call-questions/${id}/answers`, body)).data;
        return {
            id: data._id,
            title: data.title,
            selectedCount: 0
        } as CallQuestionAnswerDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tạo mới câu trả lời');
    }
};

export const updateCallQuestionAnswer = async (id: string, answerId: string, body: CallQuestionAnswerUpdateREQ) => {
    try {
        await destineeApi.patch<void>(`/call-questions/${id}/answers/${answerId}`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi cập nhật câu trả lời');
    }
};

export const deleteCallQuestionAnswer = async (id: string, answerId: string) => {
    try {
        await destineeApi.delete<void>(`/call-questions/${id}/answers/${answerId}`);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi xóa câu trả lời');
    }
};
