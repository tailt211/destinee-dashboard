interface Answer {
    _id: string;
    title: string;
    selectedCount: number;
}

export interface CallQuestionRESP {
    _id: string;
    title: string;
    answers: Answer[];
    disabled: boolean;
    createdAt: string;
    viewCount: number;
}
