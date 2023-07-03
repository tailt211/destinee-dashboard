import { REGION } from "./region.enum";

export const regionDisplayer: { [key in REGION]: { displayer: string } } = {
    NORTH_VIETNAM: { displayer: 'Miền Bắc' },
    MIDDLE_VIETNAM: { displayer: 'Miền Trung' },
    SOUTH_VIETNAM: { displayer: 'Miền Nam' },
    HA_NOI: { displayer: 'Hà Nội' },
    HO_CHI_MINH: { displayer: 'Hồ Chí Minh' },
    CAN_THO: { displayer: 'Cần Thơ' },
    KIEN_GIANG: { displayer: 'Miền Bắc' },
    TIEN_GIANG: { displayer: 'Tiền Giang' },
    BAC_NINH: { displayer: 'Bắc Ninh' },
    QUANG_NGAI: { displayer: 'Quảng Ngãi' },
};
