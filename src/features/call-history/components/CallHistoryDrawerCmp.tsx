import {
    Avatar,
    AvatarGroup,
    Badge,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
    VStack,
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { FiUsers } from 'react-icons/fi';
import { IoMdTimer } from 'react-icons/io';
import { MdCallEnd, MdDateRange } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { endReasonDisplayer, END_REASON_LABEL } from '../../../model/call-history/call-end-reason.displayer';
import { getAvatar } from '../../../model/image/image.helper';
import { TYPE_IMAGE } from '../../../model/image/type-image.enum';
import { AppDispatch, RootState } from '../../../store';
import { CallHistoryState, resetDrawer as resetCallHistoryDrawer } from '../../../store/call-history/call-history.slice';
import { fetchCallHistoryThunk } from '../../../store/call-history/call-history.thunk';
import { getPercentage } from '../../../utils/helper';
import { convertSecondToHHMMSS, convertToDateTime } from '../../../utils/time.helper';
import CallHistoryCallerQueueCmp from './CallHistoryCallerQueueCmp';

export interface CallHistoryViewDetailContent {
    id: string;
}

const CallHistoryDrawerCmp: React.FC<{
    content?: CallHistoryViewDetailContent;
    isOpen: boolean;
    onClose: () => void;
}> = ({ content, isOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { drawerLoading, callHistory } = useSelector((state: RootState) => state.callHistory) as CallHistoryState;
    const isNotAttendQuestion = useMemo(
        () =>
            !callHistory?.questions ||
            callHistory.questions.length === 0 ||
            callHistory.questions.findIndex((q) => !!q.callerOneAnswerId) === -1,
        [callHistory],
    );

    /* Effect */
    useEffect(() => {
        if (isOpen && content?.id) dispatch(fetchCallHistoryThunk(content.id));
    }, [dispatch, isOpen, content?.id]);

    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetCallHistoryDrawer());
        onClose();
    };
    return (
        <Drawer isOpen={isOpen} placement="right" size="lg" closeOnOverlayClick={true} onClose={closeDrawerHandler}>
            <DrawerOverlay />
            <DrawerContent overflow="scroll">
                <DrawerCloseButton />
                <DrawerHeader>Thông tin chi tiết</DrawerHeader>
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
                    {!drawerLoading && callHistory && (
                        <>
                            <HStack justifyContent="space-between" alignItems="flex-start">
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={IoMdTimer} color="teal" />
                                        Thời lượng:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            {callHistory.duration ? convertSecondToHHMMSS(callHistory.duration) : 'trống'}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày thực hiện:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertToDateTime(callHistory.createdAt)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdCallEnd} color="teal" />
                                        Người kết thúc:{' '}
                                        <Badge
                                            colorScheme="red"
                                            borderRadius={6}
                                            py={0.5}
                                            px={2}
                                            fontWeight="medium"
                                            fontSize={14}>
                                            {callHistory.endReason
                                                ? callHistory.endReason.enderId === callHistory.callerOne.id
                                                    ? callHistory.callerOne?.name
                                                    : callHistory.callerTwo?.name
                                                : 'Trống'}
                                        </Badge>
                                    </ListItem>
                                </List>
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={FiUsers} color="teal" />
                                        Mức độ hợp nhau:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            {callHistory.compatibility ? `${getPercentage(callHistory.compatibility)}%` : 'trống'}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        {END_REASON_LABEL}:{' '}
                                        {callHistory.endReason ? (
                                            <Badge
                                                colorScheme={endReasonDisplayer[callHistory.endReason.reason]?.colorScheme}
                                                p="3px 10px"
                                                fontWeight="medium"
                                                variant="solid"
                                                borderRadius="6">
                                                {endReasonDisplayer[callHistory.endReason.reason]?.displayer}
                                            </Badge>
                                        ) : (
                                            <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                                trống
                                            </Badge>
                                        )}
                                    </ListItem>
                                </List>
                            </HStack>
                            <Divider mt={5} mb={2} />
                            <VStack alignItems="flex-start" pt={1}>
                                <Text fontSize="lg" fontWeight="medium">
                                    Thông tin người tham gia cuộc gọi
                                </Text>
                                <HStack justifyContent="space-between" alignItems="flex-start" pt={1}>
                                    <CallHistoryCallerQueueCmp caller={callHistory.callerOne} key="1" />
                                    {callHistory.callerTwo && (
                                        <CallHistoryCallerQueueCmp caller={callHistory.callerTwo} key="2" />
                                    )}
                                </HStack>
                            </VStack>
                            <Divider mt={5} mb={2} />
                            <VStack alignItems="flex-start" pt={1} spacing={5}>
                                <VStack spacing={0.5} alignItems="flex-start">
                                    <Text fontSize="lg" fontWeight="medium">
                                        Câu hỏi kiến tạo
                                    </Text>
                                    <Text fontSize="sm" color="gray">
                                        Hai người chơi đã tham gia trả lời các câu hỏi giữa cuộc trò chuyện và đây là câu trả lời
                                        của họ
                                    </Text>
                                </VStack>
                                {isNotAttendQuestion && (
                                    <Badge colorScheme="red" borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        Người chơi không tham gia
                                    </Badge>
                                )}
                                {!isNotAttendQuestion &&
                                    callHistory.questions.map((q, i) => {
                                        const callerOneAnswer = q.answers.find((a) => a.id === q.callerOneAnswerId)!;
                                        const callerTwoAnswer = q.answers.find((a) => a.id === q.callerTwoAnswerId)!;
                                        const isSameAnswer = q.callerOneAnswerId === q.callerTwoAnswerId;
                                        return (
                                            <VStack
                                                key={q.id}
                                                alignItems="flex-start"
                                                borderRadius={6}
                                                bgColor="gray.100"
                                                w="400px"
                                                p={3}
                                                boxShadow="2xl"
                                                border={isSameAnswer ? '5px solid #237268' : undefined}>
                                                <Text fontSize="md" fontWeight="medium">
                                                    {i + 1}. {q.title}
                                                </Text>
                                                {isSameAnswer ? (
                                                    <HStack spacing={2}>
                                                        <AvatarGroup size="sm">
                                                            <Avatar
                                                                name="avatar"
                                                                src={getAvatar(
                                                                    callHistory.callerOne.avatar,
                                                                    TYPE_IMAGE.SQUARE,
                                                                    callHistory.callerOne.gender,
                                                                )}
                                                            />
                                                            <Avatar
                                                                name="avatar"
                                                                src={getAvatar(
                                                                    callHistory.callerTwo!.avatar,
                                                                    TYPE_IMAGE.SQUARE,
                                                                    callHistory.callerTwo!.gender,
                                                                )}
                                                            />
                                                        </AvatarGroup>
                                                        <Text fontSize="md" fontWeight="normal">
                                                            {callerOneAnswer.title}
                                                        </Text>
                                                    </HStack>
                                                ) : (
                                                    <>
                                                        <HStack spacing={2}>
                                                            <Avatar
                                                                size="sm"
                                                                name="avatar"
                                                                src={getAvatar(
                                                                    callHistory.callerOne!.avatar,
                                                                    TYPE_IMAGE.SQUARE,
                                                                    callHistory.callerOne!.gender,
                                                                )}
                                                            />
                                                            <Text fontSize="md" fontWeight="normal">
                                                                {callerOneAnswer.title}
                                                            </Text>
                                                        </HStack>
                                                        <HStack spacing={2}>
                                                            <Avatar
                                                                size="sm"
                                                                name="avatar"
                                                                src={getAvatar(
                                                                    callHistory.callerTwo!.avatar,
                                                                    TYPE_IMAGE.SQUARE,
                                                                    callHistory.callerTwo!.gender,
                                                                )}
                                                            />
                                                            <Text fontSize="md" fontWeight="normal">
                                                                {callerTwoAnswer.title}
                                                            </Text>
                                                        </HStack>
                                                    </>
                                                )}
                                            </VStack>
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

export default CallHistoryDrawerCmp;
