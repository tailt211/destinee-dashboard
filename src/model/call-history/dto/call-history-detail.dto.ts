import { GENDER } from '../../profile/gender.enum';
import { LANGUAGE } from '../../profile/language.enum';
import { REGION } from '../../profile/region.enum';
import { SEX } from '../../profile/sex.enum';
import { CALL_END_REASON } from '../call-end-reason.enum';
import { REVIEW } from '../review.enum';
import { TOPIC } from '../topic.enum';

interface CallFilter {
    gender: GENDER;
    origin?: REGION;
    ageRange: [number, number];
    topic?: TOPIC;
    language?: LANGUAGE;
    sex?: SEX;
}

export interface CallerInfo {
    id: string;
    name: string;
    rates: number | null;
    avatar: string | null;
    gender: GENDER;
    reviews: REVIEW[] | null;
    queueTime: number;
    filter: CallFilter;
}

export interface Answer {
    id: string;

    title: string;
}

export interface Question {
    id: string;
    title: string;
    answers: Answer[];
    callerOneAnswerId?: string;
    callerTwoAnswerId?: string;
}

export interface CallHistoryDetailDTO {
    id: string;
    callerOne: CallerInfo;
    callerTwo: CallerInfo | null;
    compatibility: number | null;
    duration: number | null;
    questions: Question[];
    endReason: {
        enderId: string;
        reason: CALL_END_REASON;
    } | null;
    createdAt: string;
}
