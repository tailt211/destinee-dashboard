import { ORDER_STATUS } from "./order-status.enum";

export const orderStatusDisplayer: { [key in ORDER_STATUS]: { displayer: string; colorScheme: string; } } = {
    ON_PROGRESS: { displayer: 'Đang thực hiện' , colorScheme: 'dWarn' },
    SUCCEEDED: { displayer: 'Thành công', colorScheme: 'dGreen' },
    CANCELED: { displayer: 'Hủy',  colorScheme: 'dDanger' },
};

export const ORDER_STATUS_LABEL = 'Trạng thái';