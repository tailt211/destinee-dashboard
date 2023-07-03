import { MbtiResultDTO } from '../../mbti-test/dto/mbti-result.dto';
import { GENDER } from '../gender.enum';
import { JOB } from '../job.enum';
import { LANGUAGE } from '../language.enum';
import { REGION } from '../region.enum';
import { SEX } from '../sex.enum';
import { ProfileStatisticsDTO } from './profile-statistics.dto';

export interface ProfileDTO {
    name: string;
    nickname: string;
    username: string;
    avatar: string;
    birthdate: string;
    origin: REGION;
    gender: GENDER;
    sex: SEX;
    job: JOB;
    workAt: string;
    major: string;
    height: number;
    languages: LANGUAGE[];
    hobbies: string[];
    disabled: boolean;
    mbtiTestCount: number;
    friendCount: number;
    postCount: number;
    statistics?: ProfileStatisticsDTO;
    mbtiResult: MbtiResultDTO | null;
}
