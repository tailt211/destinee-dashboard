import { CALL_END_REASON } from './call-end-reason.enum';

export const endReasonDisplayer: { [key in CALL_END_REASON]: { displayer: string, colorScheme: string } } = {
    NORMAL_END: { displayer: 'Thành công', colorScheme: 'dGreen' },
    STOP_FINDING: { displayer: 'Huỷ hàng chờ', colorScheme: 'dWarn' },
    NO_CONNECTION: { displayer: 'Mất kết nối', colorScheme: 'dDanger' },
};

export const END_REASON_LABEL = 'Lý do kết thúc';
