import {
    Badge,
    Button,
    HStack,
    Spinner,
    Tab,
    Table,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Bar, Chart } from 'react-chartjs-2';
import { FaFilter, FaPhoneAlt, FaStar } from 'react-icons/fa';
import { MdWifiTethering } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../store';
import { fetchCallQuestionsThunk } from '../../store/call-question/call-question.thunk';
import { fetchPerProfileRateReviewStatsThunk } from '../../store/statistics/statistics.thunk';
import StatisticsCustomChartCmp, { statisticsChartOptions } from './components/StatisticsCustomChartCmp';
import StatisticsDrawerCmp, { StatisticDrawerContent } from './components/StatisticsDrawerCmp';
import StatsBoxCmp from './components/StatisticsStatsBoxCmp';
import useStats from './hooks/use-stats';

import {
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { reviewDisplayer } from '../../model/call-history/review-displayer';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
);

const HomePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    /* Modal */
    const [modalContent, setModalContent] = useState<StatisticDrawerContent>();
    const { isOpen: isOpenAnswerDrawer, onOpen: onOpenAnswerDrawer, onClose: onCloseAnswerlDrawer } = useDisclosure();

    /* State */
    const { perProfileRateReviewStats, loading: loadingStatistic } = useSelector((state: RootState) => state.statistics);
    const { token } = useSelector((state: RootState) => state.auth);
    const { questions, loading: loadingQuestion } = useSelector((state: RootState) => state.callQuestion);
    const { tabs } = useStats();

    /* Effect */
    useEffect(() => {
        if (token) {
            dispatch(fetchPerProfileRateReviewStatsThunk());
            dispatch(fetchCallQuestionsThunk({ sortBy: 'viewCount' }));
        }
    }, [dispatch, token]);

    return (
        <>
            <StatisticsDrawerCmp isOpen={isOpenAnswerDrawer} onClose={onCloseAnswerlDrawer} content={modalContent} />
            <VStack spacing={4} width="100%">
                <HStack w="full" mb={2} justifyContent="space-around">
                    <StatsBoxCmp title="Người dùng trực tuyến" content={'1000 người'} icon={MdWifiTethering} />
                    <StatsBoxCmp title="Người dùng đang tìm kiếm cuộc gọi" content={'300 người'} icon={FaFilter} />
                    <StatsBoxCmp title="Người dùng đang trong cuộc gọi" content={'700 người'} icon={FaPhoneAlt} />
                    <StatsBoxCmp
                        title="Tỉ lệ đánh giá trung bình"
                        content={
                            !perProfileRateReviewStats?.perProfileMeanCallRates
                                ? 'Không có dữ liệu'
                                : `${Number(perProfileRateReviewStats.perProfileMeanCallRates).toFixed(2)} / 5 ★`
                        }
                        icon={FaStar}
                    />
                </HStack>
                <Tabs align="center" variant="line" colorScheme="dTeal" onChange={console.log}>
                    <TabList>
                        {tabs.map((tab) => (
                            <Tab key={tab.tabName}>{tab.tabName}</Tab>
                        ))}
                    </TabList>
                    <TabPanels bg="white">
                        {tabs.map((tab) => (
                            <TabPanel key={tab.tabName}>
                                <StatisticsCustomChartCmp
                                    title={tab.statsTitle}
                                    defaultRange={tab.defaultRange}
                                    onRangeChange={tab.rangeChangeHandler}
                                    loading={loadingStatistic}
                                    children={
                                        tab.statsType === 'bar' ? (
                                            <Bar data={tab.statsData} options={statisticsChartOptions(tab.statsTitle)} />
                                        ) : (
                                            <Chart
                                                type="bar"
                                                data={tab.statsData}
                                                options={statisticsChartOptions(tab.statsTitle)}
                                            />
                                        )
                                    }
                                />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </Tabs>
                <HStack justifyContent="space-between" alignItems="flex-start" h="600px" w="full">
                    <VStack
                        w="70%"
                        h="full"
                        overflowY="scroll"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        bgColor="white"
                        boxShadow="lg"
                        px={2}
                        py={5}>
                        <Text fontSize="lg" fontWeight="semibold" color="teal.600" ml={3}>
                            Top câu hỏi được trả lời nhiều nhất
                        </Text>
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    {['#', 'Tiêu đề', 'Số câu trả lời', 'Lượt hỏi', 'Trạng thái', ''].map((caption, index) => {
                                        return <Th key={index}>{caption}</Th>;
                                    })}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {loadingQuestion && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="teal.400"
                                                size="xl"
                                            />
                                        </Td>
                                    </Tr>
                                )}
                                {!loadingQuestion && questions.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loadingQuestion &&
                                    questions.length > 0 &&
                                    questions.map((question, index) => {
                                        return (
                                            <Tr key={question.id} fontSize="md" fontWeight="medium" overflow="scroll">
                                                <Td>{index + 1}</Td>
                                                <Td fontWeight="bold">{question.title}</Td>
                                                <Td>{question.answerCount}</Td>
                                                <Td>{question.viewCount}</Td>
                                                <Td>
                                                    <Badge
                                                        colorScheme={statusDisplayer(question.disabled)?.color}
                                                        p="3px 10px"
                                                        fontWeight="medium"
                                                        variant="solid"
                                                        borderRadius="6">
                                                        {statusDisplayer(question.disabled)?.displayer}
                                                    </Badge>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        colorScheme="facebook"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setModalContent({
                                                                id: question.id,
                                                            } as StatisticDrawerContent);
                                                            onOpenAnswerDrawer();
                                                        }}>
                                                        Xem chi tiết câu trả lời
                                                    </Button>
                                                </Td>
                                            </Tr>
                                        );
                                    })}
                            </Tbody>
                        </Table>
                    </VStack>

                    <VStack
                        w="30%"
                        h="full"
                        overflowY="scroll"
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        bgColor="white"
                        boxShadow="lg"
                        px={2}
                        py={5}>
                        <Text fontSize="lg" fontWeight="semibold" color="teal.600" ml={2}>
                            Top từ khoá được sử dụng đánh giá
                        </Text>
                        <Table variant="striped">
                            <Thead>
                                <Tr>
                                    {['Từ khoá', 'Lượt đánh giá'].map((v) => (
                                        <Th key={v}>{v}</Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {loadingStatistic && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center">
                                            <Spinner
                                                thickness="4px"
                                                speed="0.65s"
                                                emptyColor="gray.200"
                                                color="teal.400"
                                                size="xl"
                                            />
                                        </Td>
                                    </Tr>
                                )}
                                {!loadingStatistic && !perProfileRateReviewStats && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" fontWeight="bold">
                                            Không có thông tin
                                        </Td>
                                    </Tr>
                                )}
                                {!loadingStatistic &&
                                    perProfileRateReviewStats &&
                                    Object.entries(perProfileRateReviewStats?.reviewsCount)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([key, count]) => (
                                            <Tr key={key}>
                                                <Td>
                                                    <Badge
                                                        variant="subtle"
                                                        color="white"
                                                        bgColor={reviewDisplayer[key]?.baseColor}
                                                        p="3px 10px"
                                                        fontWeight="medium"
                                                        borderRadius="6">
                                                        {reviewDisplayer[key]?.displayer}
                                                    </Badge>
                                                </Td>
                                                <Td fontWeight="bold">{count}</Td>
                                            </Tr>
                                        ))}
                            </Tbody>
                        </Table>
                    </VStack>
                </HStack>
            </VStack>
        </>
    );
};

export default HomePage;
