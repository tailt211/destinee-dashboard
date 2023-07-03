export const formatMonney = (money: number) => {
    // const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 }
    const formated = new Intl.NumberFormat('vi-VN').format(money);
    return formated;
}