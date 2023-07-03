import { PAYMENT_STATUS } from "./payment-status.enum";

export const paymentStatusDisplayer: { [key in PAYMENT_STATUS]: { displayer: string; colorScheme: string; } } = {
    ON_PROGRESS: { displayer: 'Đang thực hiện' , colorScheme: 'dWarn' },
    SUCCEEDED: { displayer: 'Thành công', colorScheme: 'dGreen' },
    CANCELED: { displayer: 'Hủy',  colorScheme: 'dDanger' },
};

export const PAYMENT_STATUS_LABEL = 'Trạng thái';
export const GATEWAY_LABEL = 'Cổng thanh toán';