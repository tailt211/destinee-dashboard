export const getPercentageBadge = (percentage: number) => {
    if (percentage <= 25) return 'red.400'
    if (percentage >= 90) return 'green.400'
    if (percentage >= 75) return 'green.200'
    if (percentage >= 50) return 'green.100'
    if (25 < percentage && percentage < 50) return 'yellow.200'
    return '';
};
