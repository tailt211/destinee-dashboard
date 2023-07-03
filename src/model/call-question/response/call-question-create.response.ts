export interface CallQuestionCreateRESP {
    _id: string;
    title: string;
    answers: {
        title: string;
    }[];
    createdAt: string;
    disabled: boolean;
}
