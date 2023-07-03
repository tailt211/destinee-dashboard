import { MBTI_PROCESSING_STATE } from '../mbti-processing-state.enum';
import { MbtiResultDTO } from './mbti-result.dto';

export interface MbtiTestOverallDTO {
    id: string;
    owner: { name: string; username: string; avatar: string | null };
    answerCount: number;
    result: MbtiResultDTO | null;
    processingState: MBTI_PROCESSING_STATE;
    createdAt: string;
}
