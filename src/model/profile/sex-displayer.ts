import { SEX } from './sex.enum';

export const sexDisplayer: { [key in SEX]: { displayer: string } } = {
    STRAIGHT: { displayer: 'Thẳng' },
    BOT: { displayer: 'Xu hướng Bot' },
    TOP: { displayer: 'Xu hướng Top' },
};
