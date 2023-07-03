import {
    Avatar,
    Badge,
    Box,
    Button,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AiOutlineNumber } from 'react-icons/ai';
import { MdDateRange, MdFormatListNumbered, MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { mbtiAnswerDisplayer } from '../../../model/mbti-test/mbti-answer-displayer';
import { mbtiCategoryDisplayer } from '../../../model/mbti-test/mbti-category-displayer';
import { mbtiProcessingStateDisplayer } from '../../../model/mbti-test/mbti-processing-state-displayer';
import { mbtiQuestionsDisplayer } from '../../../model/mbti-test/mbti-questions-displayer';
import { mbtiTypeDisplayer } from '../../../model/mbti-test/mbti-type-displayer';
import { AppDispatch, RootState } from '../../../store';
import { MbtiTestState, resetDrawer as resetMbtiTestDrawer } from '../../../store/mbti-test/mbti-test.slice';
import { fetchMbtiTestThunk } from '../../../store/mbti-test/mbti-test.thunk';
import { convertToDateTime } from '../../../utils/time.helper';

export interface MbtiTestDrawerContent {
    id: string;
}

const MbtiTestDrawerCmp: React.FC<{
    content?: MbtiTestDrawerContent;
    isOpen: boolean;
    onClose: () => void;
}> = ({ content, isOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { drawerLoading, mbtiTest } = useSelector((state: RootState) => state.mbtiTest) as MbtiTestState;

    /* Effect */
    useEffect(() => {
        if (isOpen && content?.id) dispatch(fetchMbtiTestThunk(content.id));
    }, [dispatch, isOpen, content?.id]);

    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetMbtiTestDrawer());
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
                    {!drawerLoading && mbtiTest && (
                        <>
                            <Box bgColor="blackAlpha.200" py={3} pl={3} alignItems="start" borderRadius="lg">
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={AiOutlineNumber} color="teal" />
                                        ID: <b>{mbtiTest.id}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPerson} color="teal" />
                                        Người thực hiện:
                                        <Flex
                                            align="center"
                                            mt={2}
                                            py={3}
                                            px={4}
                                            borderRadius="lg"
                                            boxShadow="md"
                                            w="fit-content"
                                            minW="280px"
                                            bg="white">
                                            <Avatar
                                                name={mbtiTest.owner.name}
                                                src={mbtiTest.owner.avatar || undefined}
                                                w="50px"
                                                borderRadius="12px"
                                                me="18px"
                                            />
                                            <Flex direction="column" gap="5px">
                                                <Text fontSize="md" fontWeight="bold" minWidth="100%">
                                                    {mbtiTest.owner.name}
                                                </Text>
                                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                    {mbtiTest.owner.username}
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdFormatListNumbered} color="teal" />
                                        Số câu trả lời:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            {mbtiTest.answerCount} / {Object.keys(mbtiQuestionsDisplayer).length}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPerson} color="teal" />
                                        Kết quả:{' '}
                                        {mbtiTest.result?.type ? (
                                            <Badge
                                                bg={
                                                    mbtiCategoryDisplayer[mbtiTypeDisplayer[mbtiTest.result.type]?.category]
                                                        .bgColor
                                                }
                                                color="white"
                                                p="3px 10px"
                                                fontWeight="medium"
                                                borderRadius="8px">
                                                {mbtiTest.result.type} - {mbtiTypeDisplayer[mbtiTest.result.type]?.displayer}
                                            </Badge>
                                        ) : (
                                            <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                                trống
                                            </Badge>
                                        )}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPowerSettingsNew} color="teal" />
                                        Trạng thái:{' '}
                                        <Badge
                                            bgColor={mbtiProcessingStateDisplayer[mbtiTest.processingState]?.color}
                                            color="white"
                                            p="3px 10px"
                                            fontWeight="medium"
                                            borderRadius="8px">
                                            {mbtiProcessingStateDisplayer[mbtiTest.processingState]?.displayer}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày tạo:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertToDateTime(mbtiTest.createdAt)}
                                        </Badge>
                                    </ListItem>
                                </List>
                            </Box>
                            <Divider mt="5" mb="3" />
                            <Text fontSize="xl" fontWeight="medium">
                                Danh sách câu trả lời
                            </Text>
                            {mbtiTest.answers.length === 0 && (
                                <Badge colorScheme="red" mt={2} borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                    Chưa trả lời câu hỏi nào
                                </Badge>
                            )}
                            <List mt={2} spacing={4}>
                                {mbtiTest.answers.map((a) => (
                                    <ListItem key={a.questionId} py={3.5} px={4} borderRadius="lg" boxShadow="lg">
                                        <Text fontWeight="medium" fontSize={17}>
                                            {a.questionId}. {mbtiQuestionsDisplayer[a.questionId]?.vietnamese}
                                        </Text>
                                        <Badge
                                            bgColor={mbtiAnswerDisplayer[a.answer]?.backgroundColor}
                                            color="white"
                                            borderRadius={6}
                                            mt={2}
                                            py={0.5}
                                            px={1.5}
                                            fontWeight="medium"
                                            fontSize={14}>
                                            {mbtiAnswerDisplayer[a.answer]?.title}
                                        </Badge>
                                    </ListItem>
                                ))}
                            </List>
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

export default MbtiTestDrawerCmp;
