import { MBTI_ANSWER } from './mbti-answer.enum';

export const mbtiAnswerDisplayer: {
    [key in MBTI_ANSWER]: { title: string; backgroundColor: string };
} = {
    TOTAL_AGREE: { title: 'Rất chính xác', backgroundColor: '#19785c' },
    QUITE_AGREE: { title: 'Khá chính xác', backgroundColor: '#43B794' },
    AGREE: { title: 'Đúng', backgroundColor: '#5e8176' },
    NEUTRAL: { title: 'Trung lập', backgroundColor: '#7E7B7B' },
    DISAGREE: { title: 'Sai', backgroundColor: '#9d6d6d' },
    QUITE_DISAGREE: { title: 'Khá sai', backgroundColor: '#E44949' },
    TOTAL_DISAGREE: { title: 'Hoàn toàn sai', backgroundColor: '#cd1212' },
};
