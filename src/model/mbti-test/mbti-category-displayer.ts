import { MBTI_CATEGORY } from './mbti-category.enum';

export const mbtiCategoryDisplayer: { [key in MBTI_CATEGORY]: { displayer: string; bgColor: string } } = {
    ANALYST: { displayer: 'Nhà phân tích', bgColor: '#88619A' },
    DIPLOMAT: { displayer: 'Nhà ngoại giao', bgColor: '#33A474' },
    SENTINEL: { displayer: 'Nhà bảo vệ', bgColor: '#4298B4' },
    EXPLORER: { displayer: 'Nhà thám hiểm', bgColor: '#D8A537' },
};
