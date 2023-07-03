interface CallerInfo {
    id: string;
    name: string;
    rates: number;
    avatar: string | null;
    gender: boolean;
}

export interface CallHistoryOverallRESP {
    id: string;
    callerOne: CallerInfo;
    callerTwo: CallerInfo | null;
    compatibility: number | null;
    duration: number | null;
    endReason: {
        ender: string;
        reason: string;
    } | null;
    createdAt: string;
}
