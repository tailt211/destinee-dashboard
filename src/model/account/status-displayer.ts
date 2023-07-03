type StatusDisplayer = (isDisabled: boolean) => { displayer: string; color: string; colorScheme: string };

export const statusDisplayer: StatusDisplayer = (isDisabled) =>
    isDisabled
        ? { displayer: 'Vô hiệu hoá', color: 'red', colorScheme: 'dDanger' }
        : { displayer: 'Kích hoạt', color: 'green', colorScheme: 'dGreen' };
