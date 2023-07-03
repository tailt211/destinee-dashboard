import {
    Badge,
    Button,
    Center,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Spinner,
    Text,
    VStack
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { resetDrawer } from '../../../store/call-question/call-question.slice';
import { fetchCallQuestionThunk } from '../../../store/call-question/call-question.thunk';
import { convertToDateTime } from '../../../utils/time.helper';

export interface StatisticDrawerContent {
    id: string;
}

const StatisticsDrawerCmp: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    content?: StatisticDrawerContent;
}> = ({ isOpen, onClose, content }) => {
    const dispatch: AppDispatch = useDispatch();
    const { token } = useSelector((state: RootState) => state.auth);
    const { question, drawerLoading } = useSelector((state: RootState) => state.callQuestion);
    const maxSelectedCount = useMemo(
        () => (question ? Math.max(...question.answers.map((ans) => ans.selectedCount), 0) : 0),
        [question],
    );

    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetDrawer());
        onClose();
    };

    /* Effect */
    useEffect(() => {
        if (token && content) dispatch(fetchCallQuestionThunk(content.id));
    }, [dispatch, token, content]);

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={closeDrawerHandler} size="sm">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Chi tiết câu hỏi</DrawerHeader>
                <DrawerBody>
                    {drawerLoading && (
                        <Spinner
                            mx="auto"
                            display="block"
                            position="absolute"
                            left="50%"
                            top="50%"
                            translateX="-50%"
                            translateY="-50%"
                            size="lg"
                        />
                    )}
                    {!drawerLoading && (
                        <>
                            {question && (
                                <VStack bgColor="blackAlpha.300" py={3} pl={3} alignItems="start" borderRadius="lg">
                                    <Text>
                                        ID: <b>{question.id}</b>
                                    </Text>
                                    <Text>
                                        Tiêu đề: <b>{question.title}</b>
                                    </Text>
                                    <Text>
                                        Số lần hiển thị:{' '}
                                        <Badge
                                            colorScheme="teal"
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6">
                                            {question.viewCount}
                                        </Badge>
                                    </Text>
                                    <Text>
                                        Ngày tạo: <b>{convertToDateTime(question.createdAt, 'date')}</b>
                                    </Text>
                                    <Text>
                                        Trạng thái:{'  '}
                                        <Badge
                                            colorScheme={statusDisplayer(question.disabled)?.color}
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6">
                                            {statusDisplayer(question.disabled)?.displayer}
                                        </Badge>
                                    </Text>
                                </VStack>
                            )}
                            <Divider mt={4} mb={3}/>
                            <VStack spacing={3} alignItems='flex-start'>
                                <Text fontSize="lg" fontWeight="semibold" color="teal.600" ml={2} mb={-5}>
                                    Danh sách câu trả lời
                                </Text>
                                {question?.answers.map((answer, i) => {
                                    return (
                                        <HStack
                                            key={answer.id}
                                            bg="whiteAlpha.500"
                                            borderRadius="lg"
                                            px={5}
                                            boxShadow="xl"
                                            justifyContent="space-between"
                                            spacing={5}
                                            w="full"
                                            h="100px">
                                            <VStack alignItems="flex-start">
                                                {answer.selectedCount !== 0 && answer.selectedCount >= maxSelectedCount && (
                                                    <Badge
                                                        colorScheme="teal"
                                                        p="3px 10px"
                                                        fontWeight="medium"
                                                        variant="solid"
                                                        borderRadius="6">
                                                        Được chọn nhiều nhất
                                                    </Badge>
                                                )}
                                                <Text fontSize="17px" color="black" fontWeight="medium" mb="6px" my="6px">
                                                    {i + 1}. {answer.title}
                                                </Text>
                                            </VStack>
                                            <Center border="4px" borderRadius="lg" minW="65px" w="65px" h="65px" color="teal.600">
                                                <Text as="b" mr={1} fontSize="md" color="blackAlpha.800">
                                                    {answer.selectedCount}
                                                </Text>
                                                <Text color="blackAlpha.800">lần</Text>
                                            </Center>
                                        </HStack>
                                    );
                                })}
                            </VStack>
                        </>
                    )}
                </DrawerBody>
                <DrawerFooter>
                    <Button ml={3} onClick={closeDrawerHandler}>
                        Đóng
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default StatisticsDrawerCmp;
