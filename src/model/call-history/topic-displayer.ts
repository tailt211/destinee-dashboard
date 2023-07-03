import { TOPIC } from './topic.enum';

export const topicDisplayer: { [key in TOPIC]: { displayer: string } } = {
    LOVE: { displayer: 'Tình yêu' },
    SCHOOL: { displayer: 'Trường học' },
    SHARE: { displayer: 'Tâm sự' },
};
