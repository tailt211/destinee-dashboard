import { MBTI_CATEGORY } from './mbti-category.enum';
import { MBTI_TYPE } from './mbti-type.enum';

export const mbtiTypeDisplayer: { [key in MBTI_TYPE]: { displayer: string; category: MBTI_CATEGORY } } = {
    INTJ: { displayer: 'Người xây dựng', category: MBTI_CATEGORY.ANALYST },
    INTP: { displayer: 'Nhà tư duy', category: MBTI_CATEGORY.ANALYST },
    ENTJ: { displayer: 'Người lãnh đạo', category: MBTI_CATEGORY.ANALYST },
    ENTP: { displayer: 'Người tranh luận', category: MBTI_CATEGORY.ANALYST },
    INFJ: { displayer: 'Nhà bảo vệ', category: MBTI_CATEGORY.DIPLOMAT },
    INFP: { displayer: 'Người hoà giải', category: MBTI_CATEGORY.DIPLOMAT },
    ENFJ: { displayer: 'Người chủ xướng', category: MBTI_CATEGORY.DIPLOMAT },
    ENFP: { displayer: 'Người truyền cảm hứng', category: MBTI_CATEGORY.DIPLOMAT },
    ISTJ: { displayer: 'Nhà suy luận', category: MBTI_CATEGORY.SENTINEL },
    ISFJ: { displayer: 'Người bảo vệ', category: MBTI_CATEGORY.SENTINEL },
    ESTJ: { displayer: 'Người thực thi', category: MBTI_CATEGORY.SENTINEL },
    ESFJ: { displayer: 'Người quan tâm', category: MBTI_CATEGORY.SENTINEL },
    ISTP: { displayer: 'Thợ thủ công', category: MBTI_CATEGORY.EXPLORER },
    ISFP: { displayer: 'Người phiêu lưu', category: MBTI_CATEGORY.EXPLORER },
    ESTP: { displayer: 'Nhà kinh doanh', category: MBTI_CATEGORY.EXPLORER },
    ESFP: { displayer: 'Người trình diễn', category: MBTI_CATEGORY.EXPLORER },
};
