import { MbtiResultRESP } from './mbti-result.response';

export interface MbtiTestOverallRESP {
    id: string;
    owner: { name: string; username: string; avatar: string | null };
    answerCount: number;
    result: MbtiResultRESP | null;
    processingState: string;
    createdAt: string;
}
