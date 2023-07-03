import { GENDER } from '../../profile/gender.enum';
import { CALL_END_REASON } from '../call-end-reason.enum';

export interface CallerInfo {
    id: string;
    name: string;
    rates: number | null;
    avatar: string | null;
    gender: GENDER;
}

export interface CallHistoryOverallDTO {
    id: string;
    callerOne: CallerInfo;
    callerTwo: CallerInfo | null;
    compatibility: number | null;
    duration: number | null;
    endReason: {
        ender: string;
        reason: CALL_END_REASON;
    } | null;
    createdAt: string;
}
