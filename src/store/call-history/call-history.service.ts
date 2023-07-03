import { isUndefined, omitBy } from 'lodash';
import { destineeApi } from '../../https';
import { CALL_END_REASON } from '../../model/call-history/call-end-reason.enum';
import { CallerInfo as CallerInfoDTO, CallHistoryDetailDTO } from '../../model/call-history/dto/call-history-detail.dto';
import { CallHistoryOverallDTO } from '../../model/call-history/dto/call-history-overall.dto';
import {
    CallerInfo as CallerInfoRESP,
    CallHistoryDetailRESP,
} from '../../model/call-history/response/call-history-detail.response';
import { CallHistoryOverallRESP } from '../../model/call-history/response/call-history-overall.response';
import { TOPIC } from '../../model/call-history/topic.enum';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaginationRESP } from '../../model/pagination.response';
import { GENDER } from '../../model/profile/gender.enum';
import { LANGUAGE } from '../../model/profile/language.enum';
import { REGION } from '../../model/profile/region.enum';
import { SEX } from '../../model/profile/sex.enum';

export const fetchCallHistories = async (
    limit?: number,
    page?: number,
    orderBy?: ORDER_BY,
    sortBy?: string,
    participants?: string[],
    endReason?: CALL_END_REASON,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<CallHistoryOverallRESP>>(`/call-histories/dashboard`, {
                params: { limit, page, orderBy, sortBy, participants, endReason },
            })
        ).data;
        return {
            callHistories: data.results.map((history) => ({
                id: history.id,
                callerOne: {
                    id: history.callerOne.id,
                    name: history.callerOne.name,
                    avatar: history.callerOne.avatar,
                    gender: history.callerOne.gender ? GENDER.MALE : GENDER.FEMALE,
                    rates: history.callerOne.rates,
                },
                callerTwo: history.callerTwo
                    ? {
                          id: history.callerTwo.id,
                          name: history.callerTwo.name,
                          avatar: history.callerTwo.avatar,
                          gender: history.callerTwo.gender ? GENDER.MALE : GENDER.FEMALE,
                          rates: history.callerTwo.rates,
                      }
                    : null,
                compatibility: history.compatibility,
                duration: history.duration,
                createdAt: history.createdAt,
                endReason: history.endReason && {
                    ender: history.endReason.ender,
                    reason: history.endReason.reason,
                },
            })) as CallHistoryOverallDTO[],
            totalPage: data.totalPage,
            page: data.page,
        };
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải danh sách lịch sử cuộc gọi');
    }
};

const parseCallerInfo = (callerResp: CallerInfoRESP) => {
    return {
        id: callerResp.id,
        name: callerResp.name,
        avatar: callerResp.avatar,
        gender: callerResp.gender ? GENDER.MALE : GENDER.FEMALE,
        rates: callerResp.rates,
        filter: omitBy(
            {
                gender: callerResp.filter.gender ? GENDER.MALE : GENDER.FEMALE,
                ageRange: callerResp.filter.ageRange,
                language: callerResp.filter.language && LANGUAGE[callerResp.filter.language],
                origin: callerResp.filter.origin && REGION[callerResp.filter.origin],
                sex: callerResp.filter.sex && SEX[callerResp.filter.sex],
                topic: callerResp.filter.topic && TOPIC[callerResp.filter.topic],
            },
            isUndefined,
        ),
        queueTime: callerResp.queueTime,
        reviews: callerResp.reviews,
    } as CallerInfoDTO;
};

export const fetchCallHistory = async (id: string) => {
    try {
        const data = (await destineeApi.get<CallHistoryDetailRESP>(`/call-histories/${id}`)).data;
        return {
            id: data.id,
            callerOne: parseCallerInfo(data.callerOne),
            callerTwo: data.callerTwo ? parseCallerInfo(data.callerTwo) : null,
            compatibility: data.compatibility,
            duration: data.duration,
            createdAt: data.createdAt,
            endReason: data.endReason
                ? {
                      enderId: data.endReason.ender,
                      reason: CALL_END_REASON[data.endReason.reason],
                  }
                : null,
            questions: data.questions,
        } as CallHistoryDetailDTO;
    } catch (err: any) {
        console.error(err);
        throw new Error('Đã có lỗi xảy ra khi tải lịch sử cuộc gọi');
    }
};
