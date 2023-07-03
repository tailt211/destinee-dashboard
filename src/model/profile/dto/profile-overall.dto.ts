import { MbtiResultDTO } from "../../mbti-test/dto/mbti-result.dto";

export interface ProfileOverallDTO {
    id: string;
    name: string;
    nickname: string;
    username: string;
    avatar?: string;
    accountId: string;
    disabled?: boolean;
    createdAt: string;
    callCount: number;
    callDuration: number;
    meanCallDuration:number;
    droppedQueueRatio: number;
    ratedRatio: number;
    ratingRatio: number;
    mbtiResult: MbtiResultDTO | null;
}