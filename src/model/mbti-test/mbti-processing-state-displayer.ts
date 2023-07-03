import { MBTI_PROCESSING_STATE } from './mbti-processing-state.enum';

export const mbtiProcessingStateDisplayer: { [key in MBTI_PROCESSING_STATE]: { displayer: string; color: string; colorScheme: string } } = {
    NOT_READY: { displayer: 'Chưa hoàn tất', color: 'gray.500', colorScheme: '' },
    PENDING: { displayer: 'Chờ xử lý', color: 'teal.500', colorScheme: 'dTeal' },
    PROCESSING: { displayer: 'Đang xử lý', color: 'yellow.500', colorScheme: 'dWarn' },
    SUCCEED: { displayer: 'Thành công', color: 'green.500', colorScheme: 'dGreen' },
    FAILED: { displayer: 'Thất bại', color: 'red.400', colorScheme: 'dDanger' },
};
