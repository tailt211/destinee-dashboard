import { HStack, Radio, RadioGroup, Spinner, Text, VStack } from '@chakra-ui/react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    ChartType,
    Legend,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { rangeDisplayer } from '../../../model/statistics/range-displayer';
import { RANGE } from '../../../model/statistics/range.enum';
import { RootState } from '../../../store';
import { AuthState } from '../../../store/auth/auth.slice';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Title, Tooltip, Legend);

export const statisticsChartOptions = (title: string) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                fullSize: false,
            },
            // title: {
            //     display: true,
            //     text: title,
            //     font: { size: 16 },
            // },
        },
    } as ChartOptions<ChartType>;
};

const StatisticsCustomChartCmp: React.FC<{
    onRangeChange: (value: RANGE) => void;
    defaultRange: RANGE;
    title: string;
    children: JSX.Element;
    loading: boolean;
}> = ({ defaultRange, title, children, onRangeChange, loading = false }) => {
    /* State */
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const [range, setRange] = useState<RANGE>(defaultRange);
    /* Handler */
    const rangeChangeHandler = (value: string) => {
        setRange(RANGE[value]);
    };
    /* Effect */
    useEffect(() => {
        if (!token) return;
        onRangeChange(range);
    }, [range, onRangeChange, token]);

    return (
        <VStack alignItems="flex-end" w="full" maxW="1100px">
            <HStack justifyContent="space-between" w="full" mb={3}>
                <HStack spacing={2}>
                    <Text fontSize="lg" fontWeight="semibold" color="teal.600">
                        Biểu đồ {title}
                    </Text>
                    {loading && <Spinner color="teal.600" size="sm" />}
                </HStack>
                <RadioGroup onChange={rangeChangeHandler} value={range} colorScheme="green">
                    <HStack>
                        {Object.entries(rangeDisplayer).map(([key, title]) => (
                            <Radio key={key} value={key} colorScheme="teal">
                                {title}
                            </Radio>
                        ))}
                    </HStack>
                </RadioGroup>
            </HStack>
            {children}
        </VStack>
    );
};

export default StatisticsCustomChartCmp;
