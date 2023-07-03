interface CallFilter {
    gender: boolean;
    origin?: string;
    ageRange: [number, number];
    topic?: string;
    language?: string;
    sex?: string;
}

export interface CallerInfo {
    id: string;
    name: string;
    rates: number | null;
    avatar: string | null;
    gender: boolean;
    reviews: string[] | null;
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

export interface CallHistoryDetailRESP {
    id: string;
    callerOne: CallerInfo;
    callerTwo: CallerInfo | null;
    compatibility: number | null;
    duration: number | null;
    questions: Question[];
    endReason: {
        ender: string;
        reason: string;
    } | null;
    createdAt: string;
}