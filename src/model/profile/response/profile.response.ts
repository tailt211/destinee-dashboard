import { MbtiResultRESP } from '../../mbti-test/response/mbti-result.response';
import { ProfileStatisticsRESP } from './profile-statistics.response';

export interface ProfileRESP {
    name: string;
    nickname: string;
    username: string;
    avatar: string;
    birthdate: string;
    origin: string;
    gender: boolean;
    sex: string;
    job: string;
    workAt: string;
    major: string;
    height: number;
    languages: string[];
    hobbies: string[];
    disabled: boolean;
    createdAt: string;
    mbtiTestCount: number;
    friendCount: number;
    postCount: number;
    statistics?: ProfileStatisticsRESP;
    mbtiResult: MbtiResultRESP | null;
}
