import {
    Badge,
    Box,
    Button,
    Flex,
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
    VStack,
    Wrap,
} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { endReasonDisplayer, END_REASON_LABEL } from '../../model/call-history/call-end-reason.displayer';
import { CALL_END_REASON } from '../../model/call-history/call-end-reason.enum';
import { CallHistorySortBy } from '../../model/call-history/call-history-query-filter';
import { getPercentageBadge } from '../../model/call-history/history.helper';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import {
    CallHistoryState,
    initialQueryFilter as initialCallHistoryQueryFilter,
    resetState as resetCallHistoryState,
} from '../../store/call-history/call-history.slice';
import { fetchCallHistoriesThunk, fetchSearchProfilesThunk } from '../../store/call-history/call-history.thunk';
import { getPercentage } from '../../utils/helper';
import { convertSecondToHHMMSS, convertToDateTime } from '../../utils/time.helper';
import styles from './CallHistoryPage.module.scss';
import CallHistoryCallerCmp from './components/CallHistoryCallerCmp';
import CallHistoryDrawerCmp, { CallHistoryViewDetailContent } from './components/CallHistoryDrawerCmp';

type CallHistoryTableHeaderItemProps = TableHeaderItemProps & { label?: CallHistorySortBy };

const CallHistoryPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isOpen: isOpenDrawer, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
    const endReasonRef = useRef<HTMLSelectElement>(null);

    /* State */
    const [modalContent, setModalContent] = useState<CallHistoryViewDetailContent>();
    const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, callHistories, totalPage, currentPage, queryFilter, searchProfiles, searchLoading } = useSelector(
        (state: RootState) => state.callHistory,
    ) as CallHistoryState;

    /* Setup */
    const listTableHeader: CallHistoryTableHeaderItemProps[] = [
        { name: 'Người tham gia #1', isSortable: false },
        { name: 'Người tham gia #2', isSortable: false },
        { name: 'Thời lượng (chờ/gọi)', isSortable: true, orderBy: queryFilter.orderBy, label: 'duration' },
        { name: 'Độ tương hợp', isSortable: true, orderBy: queryFilter.orderBy, label: 'compatibility' },
        { name: END_REASON_LABEL, isSortable: false, center: true },
        { name: 'Thời gian tạo', isSortable: true, orderBy: queryFilter.orderBy, label: 'createdAt', center: true },
        { name: '', isSortable: false },
    ];

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchCallHistoriesThunk(initialCallHistoryQueryFilter));
        return () => {
            dispatch(resetCallHistoryState());
        };
    }, [dispatch, token]);

    useEffect(() => {
        if (token && search) dispatch(fetchSearchProfilesThunk(search));
    }, [dispatch, token, search]);

    /* Handler */
    let filterTimeout: NodeJS.Timeout | undefined;
    const handleSearch = (value: string) => {
        clearTimeout(filterTimeout);
        filterTimeout = setTimeout(() => {
            setSearch(value);
        }, 700);
    };

    const paginationHandler = (event: any) => {
        dispatch(
            fetchCallHistoriesThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };

    const sortHandler = (sortBy?: CallHistorySortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchCallHistoriesThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    const searchHandler = () => {
        const endReasonValue = endReasonRef.current?.value
            ? CALL_END_REASON[endReasonRef.current?.value as keyof typeof CALL_END_REASON]
            : undefined;
        dispatch(
            fetchCallHistoriesThunk({
                ...initialCallHistoryQueryFilter,
                endReason: endReasonValue,
                participants: selectedParticipantIds,
            }),
        );
    };

    return (
        <>
            {/* Modal */}
            <CallHistoryDrawerCmp
                content={modalContent as CallHistoryViewDetailContent}
                isOpen={isOpenDrawer}
                onClose={() => {
                    setModalContent(undefined);
                    closeDrawer();
                }}
            />
            {/* Content */}
            <Stack spacing={4}>
                <Flex gap="2" width="full">
                    <div className={styles.multiSelectName}>
                        <Multiselect
                            displayValue="name"
                            placeholder={
                                selectedParticipantIds.length === 0 ? 'Tìm theo người tham gia' : 'Người tham gia còn lại'
                            }
                            emptyRecordMsg={
                                search ? 'Không có hồ sơ phù hợp dựa trên tìm kiếm' : 'Nhập tên, nickname hoặc username...'
                            }
                            hidePlaceholder={selectedParticipantIds.length > 1}
                            avoidHighlightFirstOption={true}
                            selectionLimit={2}
                            showCheckbox={true}
                            showArrow={true}
                            options={searchProfiles}
                            loading={searchLoading}
                            onSearch={handleSearch}
                            onSelect={(profiles: ProfileSearchDTO[]) => {
                                setSelectedParticipantIds(profiles.map((profile) => profile.id));
                            }}
                            onRemove={(list: ProfileSearchDTO[]) => {
                                setSelectedParticipantIds(list.map((profile) => profile.id));
                            }}
                            style={{
                                chips: {
                                    fontSize: '16px',
                                    padding: '3px 10px',
                                    background: 'var(--chakra-colors-teal-500)',
                                },
                                multiselectContainer: {
                                    fontSize: '16px',
                                },
                                searchBox: {
                                    border: 'none',
                                    borderBottom: 'none',
                                    borderRadius: '10px',
                                },
                                inputField: {
                                    paddingLeft: '10px',
                                },
                            }}
                        />
                    </div>
                    <Select background="white" placeholder={END_REASON_LABEL} width="25%" ref={endReasonRef}>
                        {Object.entries(endReasonDisplayer).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.displayer}
                            </option>
                        ))}
                    </Select>
                    <Button colorScheme="teal" width="10%" onClick={searchHandler} type="submit">
                        Tìm kiếm
                    </Button>
                </Flex>

                <Box borderRadius="lg" background="white" padding="22px">
                    <Text fontSize="xl" fontWeight="bold" color="black">
                        Danh sách lịch sử cuộc gọi
                    </Text>
                    <Box overflowX="scroll" mt={5}>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    {listTableHeader.map((h) => (
                                        <TableHeaderItemCmp
                                            key={h.name}
                                            label={h.label}
                                            name={h.name}
                                            center={h.center}
                                            isSortable={h.isSortable}
                                            orderBy={h.orderBy}
                                            sortBy={queryFilter.sortBy}
                                            sortHandler={sortHandler.bind(null, h.label)}
                                        />
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {loading && (
                                    <Tr>
                                        <Td colSpan={7} textAlign="center" fontWeight="bold">
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
                                {!loading && callHistories.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && callHistories.length > 0 && (
                                    <>
                                        {callHistories.map((history) => {
                                            return (
                                                <Tr key={history.id} fontSize="md" fontWeight="medium">
                                                    <Td whiteSpace="nowrap">
                                                        <CallHistoryCallerCmp caller={history.callerOne} />
                                                    </Td>
                                                    <Td whiteSpace="nowrap">
                                                        {history.callerTwo && <CallHistoryCallerCmp caller={history.callerTwo} />}
                                                    </Td>
                                                    <Td>
                                                        {history.duration && (
                                                            <Badge
                                                                colorScheme={
                                                                    history.endReason?.reason === CALL_END_REASON.STOP_FINDING
                                                                        ? 'orange'
                                                                        : undefined
                                                                }
                                                                borderRadius={6}
                                                                py={0.5}
                                                                px={1}
                                                                fontWeight="medium"
                                                                fontSize={13}>
                                                                {convertSecondToHHMMSS(history.duration)}
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        {history.compatibility && (
                                                            <Badge
                                                                bg={getPercentageBadge(getPercentage(history.compatibility))}
                                                                color="black"
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                borderRadius="8px">
                                                                {getPercentage(history.compatibility)}%
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        {history.endReason && (
                                                            <VStack spacing={1}>
                                                                <Text textAlign="center">
                                                                    {history.endReason.ender === history.callerOne.id
                                                                        ? history.callerOne.name
                                                                        : history.callerTwo?.name}
                                                                </Text>
                                                                <Badge
                                                                    colorScheme={
                                                                        endReasonDisplayer[history.endReason.reason]?.colorScheme
                                                                    }
                                                                    p="3px 10px"
                                                                    fontWeight="medium"
                                                                    variant="solid"
                                                                    borderRadius="6">
                                                                    {endReasonDisplayer[history.endReason.reason]?.displayer}
                                                                </Badge>
                                                            </VStack>
                                                        )}
                                                    </Td>
                                                    <Td textAlign="center">{convertToDateTime(history.createdAt)}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            <Button
                                                                colorScheme="facebook"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({ id: history.id });
                                                                    openDrawer();
                                                                }}>
                                                                Chi tiết cuộc gọi
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
                {!loading && callHistories.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default CallHistoryPage;
