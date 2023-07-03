import { LANGUAGE } from "./language.enum";

export const languageDisplayer: { [key in LANGUAGE]: { displayer: string } } = {
    ENGLISH: { displayer: 'Tiếng Anh' },
    FRENCH: { displayer: 'Tiếng Pháp' },
    GERMAN: { displayer: 'Tiếng Đức' },
    JAPANESE: { displayer: 'Tiếng Nhật' },
    VIETNAMESE: { displayer: 'Tiếng Việt' },
};
