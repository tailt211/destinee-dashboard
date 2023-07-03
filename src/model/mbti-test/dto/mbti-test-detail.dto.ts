import { MBTI_ANSWER } from '../mbti-answer.enum';
import { MBTI_PROCESSING_STATE } from '../mbti-processing-state.enum';
import { MbtiResultDTO } from './mbti-result.dto';

export interface MbtiTestDetailDTO {
    id: string;
    owner: { name: string; username: string; avatar: string | null };
    answers: { questionId: number; answer: MBTI_ANSWER }[];
    answerCount: number;
    result: MbtiResultDTO | null;
    processingState: MBTI_PROCESSING_STATE;
    updatedAt: string;
    createdAt: string;
}
