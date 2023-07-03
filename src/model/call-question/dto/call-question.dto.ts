export interface Answer {
    id: string;
    title: string;
    selectedCount: number;
}

export interface CallQuestionDTO {
    id: string;
    title: string;
    answers: Answer[];
    createdAt: string;
    disabled: boolean;
    viewCount: number;
}
