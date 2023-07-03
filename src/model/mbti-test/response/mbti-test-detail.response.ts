import { MbtiResultRESP } from '../response/mbti-result.response';

export interface MbtiTestDetailRESP {
    id: string;
    owner: { name: string; username: string; avatar: string | null };
    answers: { questionId: number; answer: string }[];
    answerCount: number;
    result: MbtiResultRESP | null;
    processingState: string;
    updatedAt: string;
    createdAt: string;
}
