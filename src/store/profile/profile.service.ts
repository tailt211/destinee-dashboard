import { httpExceptionConverter } from '../../exception/http-exception.converter';
import { destineeApi } from '../../https';
import { REVIEW } from '../../model/call-history/review.enum';
import { mbtiConvertRESPToDTO } from '../../model/mbti-test/mbti-convert-response-to-dto';
import { MBTI_TYPE } from '../../model/mbti-test/mbti-type.enum';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaginationRESP } from '../../model/pagination.response';
import { ProfileOverallDTO } from '../../model/profile/dto/profile-overall.dto';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { GENDER } from '../../model/profile/gender.enum';
import { JOB } from '../../model/profile/job.enum';
import { LANGUAGE } from '../../model/profile/language.enum';
import { REGION } from '../../model/profile/region.enum';
import { ProfileOverallRESP } from '../../model/profile/response/profile-overall.response';
import { ProfileSearchRESP } from '../../model/profile/response/profile-search.response';
import { ProfileRESP } from '../../model/profile/response/profile.response';
import { SEX } from '../../model/profile/sex.enum';

export const fetchProfiles = async (
    limit: number = 15,
    page: number = 1,
    orderBy: ORDER_BY = ORDER_BY.DESC,
    sortBy: string = 'createdAt',
    search?: string,
    disabled?: boolean,
    mbtiType?: MBTI_TYPE,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<ProfileOverallRESP>>(`/profiles/dashboard`, {
                params: { limit, page, orderBy, sortBy, search, disabled, mbtiType },
            })
        ).data;
        return {
            profiles: data.results.map((profile) => ({
                id: profile.id,
                name: profile.name,
                nickname: profile.nickname,
                username: profile.username,
                avatar: profile.avatar ? profile.avatar : undefined,
                accountId: profile.accountId,
                disabled: profile.disabled ? profile.disabled : false,
                createdAt: profile.createdAt,
                callCount: profile.callCount,
                callDuration: profile.callDuration,
                meanCallDuration: profile.meanCallDuration,
                droppedQueueRatio: profile.droppedQueueRatio,
                ratedRatio: profile.ratedRatio,
                ratingRatio: profile.ratingRatio,
                mbtiResult: mbtiConvertRESPToDTO(profile.mbtiResult),
            } as ProfileOverallDTO)),
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách hồ sơ cá nhân');
    }
};

export const fetchProfile = async (id: string) => {
    try {
        const data = (await destineeApi.get<ProfileRESP>(`/profiles/${id}/dashboard`)).data;
        return {
            name: data.name,
            nickname: data.nickname,
            username: data.username,
            avatar: data.avatar,
            birthdate: data.birthdate,
            origin: data.origin && REGION[data.origin],
            gender: data.gender ? GENDER.MALE : GENDER.FEMALE,
            sex: data.sex && SEX[data.sex],
            job: data.job && JOB[data.job],
            workAt: data.workAt,
            major: data.major,
            height: data.height,
            languages: data.languages.map(lang => LANGUAGE[lang]),
            hobbies: data.hobbies,
            disabled: data.disabled ? data.disabled : false,
            mbtiTestCount: data.mbtiTestCount,
            friendCount: data.friendCount,
            postCount: data.postCount,
            statistics: data.statistics ? {
                ...data.statistics,
                keywordsReviewed: data.statistics.keywordsReviewed?.map(k => ({ ...k, keyword: REVIEW[k.keyword] })) || []
            } : undefined,
            mbtiResult: mbtiConvertRESPToDTO(data.mbtiResult),
        } as ProfileDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải hồ sơ cá nhân');
    }
};

export const fetchSearchProfiles = async (search: string) => {
    try {
        const data = (
            await destineeApi.get<ProfileSearchRESP[]>('/profiles/dashboard/search', {
                params: { q: search },
            })
        ).data;
        return data.map((profile) => ({
            id: profile._id,
            name: profile.name,
            nickname: profile.nickname,
            username: profile.username,
        })) as ProfileSearchDTO[];
    } catch (err: any) {
        console.log(err);
        throw new Error('Đã có lỗi khi tải danh sách hồ sơ tìm kiếm');
    }
};