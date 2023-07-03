import { destineeApi } from "../../https";
import { MbtiTestDetailDTO } from "../../model/mbti-test/dto/mbti-test-detail.dto";
import { MbtiTestOverallDTO } from "../../model/mbti-test/dto/mbti-test-overall.dto";
import { MBTI_ANSWER } from "../../model/mbti-test/mbti-answer.enum";
import { mbtiConvertRESPToDTO } from "../../model/mbti-test/mbti-convert-response-to-dto";
import { MBTI_PROCESSING_STATE } from "../../model/mbti-test/mbti-processing-state.enum";
import { MBTI_TYPE } from "../../model/mbti-test/mbti-type.enum";
import { MbtiTestDetailRESP } from "../../model/mbti-test/response/mbti-test-detail.response";
import { MbtiTestOverallRESP } from "../../model/mbti-test/response/mbti-test-overall.response";
import { ORDER_BY } from "../../model/order-by.enum";
import { PaginationRESP } from "../../model/pagination.response";

export const fetchMbtiTests = async (
    limit?: number,
    page?: number,
    orderBy?: ORDER_BY,
    sortBy?: string,
    owner?: string,
    mbtiType?: MBTI_TYPE,
    processingState?: MBTI_PROCESSING_STATE,
) => {
    try {
        const {data} = await destineeApi.get<PaginationRESP<MbtiTestOverallRESP>>(`/mbti-tests/dashboard`, {
            params: { limit, page, orderBy, sortBy, owner, mbtiType, processingState },
        })
            
        return {
            mbtiTests: data.results.map((test) => ({
                id: test.id,
                owner: { name: test.owner.name, avatar: test.owner.avatar, username: test.owner.username },
                answerCount: test.answerCount,
                result: mbtiConvertRESPToDTO(test.result),
                processingState: MBTI_PROCESSING_STATE[test.processingState],
                createdAt: test.createdAt,
            } as MbtiTestOverallDTO)),
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải danh sách bài trắc nghiệm tính cách');
    }
};

export const fetchMbtiTest = async (id: string) => {
    try {
        const {data: test} = await destineeApi.get<MbtiTestDetailRESP>(`/mbti-tests/${id}/dashboard`);
        return {
            id: test.id,
            owner: { name: test.owner.name, avatar: test.owner.avatar, username: test.owner.username },
            answers: test.answers.map(a => ({ questionId: a.questionId, answer: MBTI_ANSWER[a.answer] })),
            answerCount: test.answerCount,
            result: mbtiConvertRESPToDTO(test.result),
            processingState: MBTI_PROCESSING_STATE[test.processingState],
            createdAt: test.createdAt,
        } as MbtiTestDetailDTO;
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải bài trắc nghiệm tính cách');
    }
};
