export const convertToDateTime = (data?: string, getData?: 'date' | 'time') => {
    if (!data) return '';
    const dateTime = new Date(data);
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const date = String(dateTime.getDate()).padStart(2, '0');
    if (getData === 'date') return date + '/' + month + '/' + dateTime.getFullYear();
    if (getData === 'time') return dateTime.getHours() + ':' + dateTime.getMinutes();
    return `${date}/${month}/${dateTime.getFullYear()} - ${dateTime.getHours()}:${dateTime.getMinutes()}`;
};

export const convertSecondToHHMMSS = (duration: number) => {
    const h = Math.floor(duration / 3600);
    const m = Math.floor(duration % 3600 / 60);
    const s = Math.floor(duration % 3600 % 60);
    const hDisplay = h > 0 ? h + ' giờ ' : '';
    const mDisplay = m > 0 ? m + ' phút ' : '';
    const sDisplay = s >= 0 ? s + ' giây ' : '';
    return hDisplay + mDisplay + sDisplay;
};
