import { MbtiResultRESP } from "../../mbti-test/response/mbti-result.response";

export interface ProfileOverallRESP {
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
    mbtiResult: MbtiResultRESP | null;
}