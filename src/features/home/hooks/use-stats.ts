import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RANGE } from "../../../model/statistics/range.enum";
import { AppDispatch, RootState } from "../../../store";
import { fetchPerProfileCallCountStatsThunk, fetchPerProfileCallDurationStatsThunk, fetchPerProfileDroppedQueueRatioStatsThunk, fetchPerProfileMeanCallDurationStatsThunk, fetchPerProfileMeanQueueDurationStatsThunk, fetchQueueCountStatsThunk, fetchTotalCallCountStatsThunk, fetchTotalCallDurationStatsThunk } from "../../../store/statistics/statistics.thunk";
import { convertToDateTime } from "../../../utils/time.helper";

const getStatsData = (label: string, data: any[], labelKey: string, valueKey: string) => ({
    labels: data.map((d) => convertToDateTime(d[labelKey], 'date')),
    datasets: [
        {
            label,
            data: data.map((d) => d[valueKey]),
            // borderColor: 'rgb(255, 99, 132)',
            backgroundColor: '#43B794',
        },
    ],
});

type STATS_TAB = {
    tabName: string;
    statsTitle: string;
    defaultRange: RANGE;
    rangeChangeHandler: any;
    statsData: any;
    statsType: 'bar' | 'mixed';
};

const useStats = () => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const {
        totalCallCount,
        perProfileCallCount,
        totalCallDuration,
        perProfileCallDuration,
        perProfileMeanCallDuration,
        queueCount,
        perProfileDroppedRatio,
        perProfileMeanQueueDuration,
    } = useSelector((state: RootState) => state.statistics);

    /* Data */
    const totalCallCountData = useMemo(() => getStatsData('Số cuộc gọi', totalCallCount, 'id', 'callCount'), [totalCallCount]);
    const perProfileCallCountData = useMemo(
        () => getStatsData('Số cuộc gọi', perProfileCallCount, 'id', 'callCount'),
        [perProfileCallCount],
    );
    const totalCallDurationData = useMemo(
        () => getStatsData('Giây', totalCallDuration, 'id', 'callDuration'),
        [totalCallDuration],
    );
    const perProfileCallDurationData = useMemo(
        () => getStatsData('Giây', perProfileCallDuration, 'id', 'callDuration'),
        [perProfileCallDuration],
    );
    const perProfileMeanCallDurationData = useMemo(
        () => getStatsData('Giây', perProfileMeanCallDuration, 'id', 'meanCallDuration'),
        [perProfileMeanCallDuration],
    );
    const perProfileDroppedQueueRatioData = useMemo(
        () => getStatsData('%', perProfileDroppedRatio, 'id', 'droppedQueueRatio'),
        [perProfileDroppedRatio],
    );
    const queueCountData = useMemo(
        () => ({
            labels: queueCount.map((label) => convertToDateTime(label.id, 'date')),
            datasets: [
                {
                    type: 'line' as const,
                    label: 'Thành công',
                    borderColor: 'rgb(39, 108, 219)',
                    borderWidth: 2,
                    data: queueCount.map((queue) => queue.succeededQueueCount),
                },
                {
                    type: 'line' as const,
                    label: 'Đã huỷ',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    data: queueCount.map((queue) => queue.droppedQueueCount),
                },
                {
                    type: 'bar' as const,
                    label: 'Tổng số lần chờ',
                    backgroundColor: 'rgb(52, 235, 155)',
                    data: queueCount.map((queue) => queue.queueCount),
                },
            ],
        }),
        [queueCount],
    );
    const perProfileMeanQueueDurationData = useMemo(
        () => ({
            labels: perProfileMeanQueueDuration.map((label) => convertToDateTime(label.id, 'date')),
            datasets: [
                {
                    type: 'line' as const,
                    label: 'Thành công',
                    borderColor: 'rgb(39, 108, 219)',
                    borderWidth: 2,
                    data: perProfileMeanQueueDuration.map((queue) => queue.meanSucceededQueueDuration),
                },
                {
                    type: 'line' as const,
                    label: 'Đã huỷ',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 2,
                    data: perProfileMeanQueueDuration.map((queue) => queue.meanDroppedQueueDuration),
                },
                {
                    type: 'bar' as const,
                    label: 'Tổng thời lượng chờ (giây)',
                    backgroundColor: 'rgb(52, 235, 155)',
                    data: perProfileMeanQueueDuration.map((queue) => queue.meanQueueDuration),
                },
            ],
        }),
        [perProfileMeanQueueDuration],
    );

    /* Handler */
    const callStatsHandler = useCallback((range: RANGE) => dispatch(fetchTotalCallCountStatsThunk(range)), [dispatch]);
    const meanCallStatsHandler = useCallback((range: RANGE) => dispatch(fetchPerProfileCallCountStatsThunk(range)), [dispatch]);
    const callDurationStatsHandler = useCallback((range: RANGE) => dispatch(fetchTotalCallDurationStatsThunk(range)), [dispatch]);
    const meanCallDurationStatsHandler = useCallback(
        (range: RANGE) => dispatch(fetchPerProfileCallDurationStatsThunk(range)),
        [dispatch],
    );
    const singleCallDurationStatsHandler = useCallback(
        (range: RANGE) => dispatch(fetchPerProfileMeanCallDurationStatsThunk(range)),
        [dispatch],
    );
    const queueStatsHandler = useCallback((range: RANGE) => dispatch(fetchQueueCountStatsThunk(range)), [dispatch]);
    const meanQueueDurationStatsHandler = useCallback(
        (range: RANGE) => dispatch(fetchPerProfileMeanQueueDurationStatsThunk(range)),
        [dispatch],
    );
    const queueDroppedStatsHandler = useCallback(
        (range: RANGE) => dispatch(fetchPerProfileDroppedQueueRatioStatsThunk(range)),
        [dispatch],
    );

    const tabs: STATS_TAB[] = useMemo(
        () => [
            {
                tabName: 'Số cuộc gọi',
                statsTitle: 'tổng cuộc gọi',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: callStatsHandler,
                statsData: totalCallCountData,
                statsType: 'bar',
            },
            {
                tabName: 'Số cuộc gọi / người dùng',
                statsTitle: 'trung bình số cuộc gọi mỗi người dùng',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: meanCallStatsHandler,
                statsData: perProfileCallCountData,
                statsType: 'bar',
            },
            {
                tabName: 'Thời lượng cuộc gọi',
                statsTitle: 'tổng thời lượng gọi',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: callDurationStatsHandler,
                statsData: totalCallDurationData,
                statsType: 'bar',
            },
            {
                tabName: 'Thời lượng cuộc gọi / người dùng',
                statsTitle: 'thời lượng gọi trung bình mỗi người dùng',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: meanCallDurationStatsHandler,
                statsData: perProfileCallDurationData,
                statsType: 'bar',
            },
            {
                tabName: 'Thời lượng trung bình mỗi cuộc gọi',
                statsTitle: 'thời lượng trung bình mỗi cuộc gọi',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: singleCallDurationStatsHandler,
                statsData: perProfileMeanCallDurationData,
                statsType: 'bar',
            },
            {
                tabName: 'Tỉ lệ hủy hàng chờ',
                statsTitle: 'tỉ lệ hủy hàng chờ',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: queueDroppedStatsHandler,
                statsData: perProfileDroppedQueueRatioData,
                statsType: 'bar',
            },
            {
                tabName: 'Thông số hàng chờ',
                statsTitle: 'thông số hàng chờ',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: queueStatsHandler,
                statsData: queueCountData,
                statsType: 'mixed',
            },
            {
                tabName: 'Thông số thời lượng chờ',
                statsTitle: 'thông số thời lượng chờ',
                defaultRange: RANGE.MONTH,
                rangeChangeHandler: meanQueueDurationStatsHandler,
                statsData: perProfileMeanQueueDurationData,
                statsType: 'mixed',
            },
        ],
        [
            totalCallCountData,
            perProfileCallCountData,
            totalCallDurationData,
            perProfileCallDurationData,
            perProfileMeanCallDurationData,
            perProfileDroppedQueueRatioData,
            queueCountData,
            perProfileMeanQueueDurationData,
            callStatsHandler,
            meanCallStatsHandler,
            callDurationStatsHandler,
            meanCallDurationStatsHandler,
            singleCallDurationStatsHandler,
            queueDroppedStatsHandler,
            queueStatsHandler,
            meanQueueDurationStatsHandler,
        ],
    );

    return { tabs }
};

export default useStats;