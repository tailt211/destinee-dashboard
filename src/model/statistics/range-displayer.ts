import { RANGE } from './range.enum';

export const rangeDisplayer: { [key in RANGE]: string } = {
    WEEK: '1 tuần',
    MONTH: '1 tháng',
    HALF_YEAR: '6 tháng',
    YEAR: '1 năm',
    ALL: 'tất cả',
};
