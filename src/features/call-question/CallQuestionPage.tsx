import {
    Badge,
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Spinner,
    Stack,
    Table,
    Tbody,
    Td,
    Text,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    Wrap,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TiPlus } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../model/account/status-displayer';
import { CallQuestionSortBy } from '../../model/call-question/call-question-query-filter';
import { ORDER_BY } from '../../model/order-by.enum';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import {
    clearError as clearCallQuestionError,
    initialQueryFilter as initialCallQuestionQueryFilter,
    resetState as resetCallQuestionState,
} from '../../store/call-question/call-question.slice';
import { fetchCallQuestionsThunk } from '../../store/call-question/call-question.thunk';
import { convertToDateTime } from '../../utils/time.helper';
import CallQuestionDrawerCmp, { CallQuestionDrawerContent } from './components/CallQuestionDrawerCmp';
import CallQuestionStatusChangeModalCmp, {
    CallQuestionStatusChangeModalContent,
} from './components/CallQuestionStatusChangeModalCmp';

type CallQuestionTableHeaderItemProps = TableHeaderItemProps & { label?: CallQuestionSortBy };

const CallQuestionPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const questionToast = useToast({ isClosable: true, duration: 1500, title: 'Câu hỏi kiến tạo' });
    const answerToast = useToast({ isClosable: true, duration: 1500, title: 'Câu trả lời kiến tạo' });
    const searchRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const { isOpen: isOpenDrawer, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
    const { isOpen: isOpenStatusChangeModal, onOpen: openStatusChangeModal, onClose: closeStatusChangeModal } = useDisclosure();

    /* State */
    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, error, questions, totalPage, currentPage, queryFilter } = useSelector(
        (state: RootState) => state.callQuestion,
    );
    const [modalContent, setModalContent] = useState<CallQuestionStatusChangeModalContent | CallQuestionDrawerContent>();

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchCallQuestionsThunk({ sortBy: 'createdAt', orderBy: ORDER_BY.DESC }));
        return () => {
            dispatch(resetCallQuestionState());
        };
    }, [dispatch, token]);

    useEffect(() => {
        if (!error) return;
        questionToast({
            description: error,
            status: 'error',
            onCloseComplete: () => {
                dispatch(clearCallQuestionError());
            },
        });
    }, [error, questionToast, dispatch]);

    /* Handler */
    const searchHandler = (e: any) => {
        e.preventDefault();
        const status = statusRef.current?.value !== '' ? (statusRef.current?.value === 'true' ? true : false) : undefined;
        dispatch(fetchCallQuestionsThunk({ ...initialCallQuestionQueryFilter, search: searchRef.current?.value?.trim(), disabled: status}));
    };

    const paginationHandler = (event: any) => {
        dispatch(fetchCallQuestionsThunk({ ...queryFilter, page: event.selected + 1 }));
    };

    const sortHandler = (sortBy?: CallQuestionSortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchCallQuestionsThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    const listTableHeader: CallQuestionTableHeaderItemProps[] = [
        { name: '#', isSortable: false },
        { name: 'Tiêu đề câu hỏi', isSortable: false },
        { name: 'Số câu trả lời', isSortable: false, center: true },
        { label: 'viewCount', name: 'Số lần hiển thị', isSortable: true, center: true, orderBy: queryFilter.orderBy, },
        { name: 'Trạng thái', isSortable: false },
        { label: 'createdAt', name: 'Ngày tạo', isSortable: true, orderBy: queryFilter.orderBy },
        { name: '', isSortable: false },
    ];

    return (
        <>
            <CallQuestionDrawerCmp
                content={modalContent as CallQuestionDrawerContent}
                isOpen={isOpenDrawer}
                onClose={closeDrawer}
                answerToast={answerToast}
                questionToast={questionToast}
            />
            <CallQuestionStatusChangeModalCmp
                content={modalContent as CallQuestionStatusChangeModalContent}
                isOpen={isOpenStatusChangeModal}
                onClose={closeStatusChangeModal}
                toast={questionToast}
            />
            <Stack spacing={4}>
                <form onSubmit={searchHandler}>
                    <Flex gap="2" width="100%">
                        <InputGroup background="white" borderRadius="lg" width="100%">
                            <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                            <Input type="text" placeholder="Tìm theo câu hỏi..." ref={searchRef} />
                        </InputGroup>
                        <Select background="white" placeholder="Trạng thái" width="25%" minW="120px" ref={statusRef}>
                            <option value="false">{statusDisplayer(false).displayer}</option>
                            <option value="true">{statusDisplayer(true).displayer}</option>
                        </Select>
                        <Button type="submit" colorScheme="teal" px="10">
                            Tìm kiếm
                        </Button>
                    </Flex>
                </form>

                <Box borderRadius="lg" background="white" padding="22px">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" fontWeight="bold" color="black">
                            Danh sách câu hỏi
                        </Text>
                        <Button
                            colorScheme="teal"
                            leftIcon={<TiPlus />}
                            size="md"
                            fontWeight="bold"
                            variant="outline"
                            onClick={() => {
                                setModalContent({ isEditing: false } as CallQuestionDrawerContent);
                                openDrawer();
                            }}>
                            Tạo câu hỏi
                        </Button>
                    </Flex>
                    <Box overflowX="scroll" mt="5">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    {listTableHeader.map((h) => {
                                        return (
                                            <TableHeaderItemCmp
                                                key={h.name}
                                                label={h.label}
                                                isSortable={h.isSortable}
                                                orderBy={h.orderBy}
                                                sortBy={queryFilter.sortBy}
                                                name={h.name}
                                                sortHandler={sortHandler.bind(null, h.label)}
                                            />
                                        );
                                    })}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {loading && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" fontWeight="bold">
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
                                {!loading && questions.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={6} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && questions.length > 0 && (
                                    <>
                                        {questions.map((question, i) => {
                                            return (
                                                <Tr key={question.id} fontSize="md" fontWeight="medium">
                                                    <Td>{i + 1}</Td>
                                                    <Td fontWeight="bold">{question.title}</Td>
                                                    <Td textAlign="center">{question.answerCount}</Td>
                                                    <Td textAlign="center">{question.viewCount}</Td>
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
                                                    <Td>{convertToDateTime(question.createdAt, 'date')}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            <Button
                                                                colorScheme="facebook"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({
                                                                        id: question.id,
                                                                        isEditing: true,
                                                                    } as CallQuestionDrawerContent);
                                                                    openDrawer();
                                                                }}>
                                                                Xem / Chỉnh sửa
                                                            </Button>
                                                            <Button
                                                                colorScheme={statusDisplayer(!question.disabled)?.colorScheme}
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({
                                                                        id: question.id,
                                                                        title: question.title,
                                                                        disabled: question.disabled,
                                                                    } as CallQuestionStatusChangeModalContent);
                                                                    openStatusChangeModal();
                                                                }}>
                                                                {statusDisplayer(!question.disabled)?.displayer}
                                                            </Button>
                                                        </Wrap>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </>
                                )}
                            </Tbody>
                        </Table>
                    </Box>
                </Box>
                {!loading && questions.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default CallQuestionPage;
