export enum GATEWAY {
    VNPAY = 'VNPAY',
}

export const gatewayDispayer: { [key in GATEWAY]: { displayer: string } } = {
    VNPAY: { displayer: 'VNPAY' },
};
