import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { IconType } from 'react-icons/lib';
import { GENDER } from './gender.enum';

export const genderDisplayer: { [key in GENDER]: { displayer: string; icon: IconType; color: string } } = {
    MALE: { displayer: 'Nam', icon: IoMdMale, color: 'teal' },
    FEMALE: { displayer: 'Nữ', icon: IoMdFemale, color: 'pink.700' },
};
