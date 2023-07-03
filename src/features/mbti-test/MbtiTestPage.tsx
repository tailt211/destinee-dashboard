import {
    Avatar,
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
    Wrap,
} from '@chakra-ui/react';
import Multiselect from 'multiselect-react-dropdown';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mbtiCategoryDisplayer } from '../../model/mbti-test/mbti-category-displayer';
import { mbtiProcessingStateDisplayer } from '../../model/mbti-test/mbti-processing-state-displayer';
import { MBTI_PROCESSING_STATE } from '../../model/mbti-test/mbti-processing-state.enum';
import { mbtiQuestionsDisplayer } from '../../model/mbti-test/mbti-questions-displayer';
import { MbtiTestSortBy } from '../../model/mbti-test/mbti-test-query-filter';
import { mbtiTypeDisplayer } from '../../model/mbti-test/mbti-type-displayer';
import { MBTI_TYPE } from '../../model/mbti-test/mbti-type.enum';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import {
    initialQueryFilter as initialMbtiTestQueryFilter,
    MbtiTestState,
    resetState as resetMbtiTestState,
} from '../../store/mbti-test/mbti-test.slice';
import { fetchMbtiTestsThunk, fetchSearchProfilesThunk } from '../../store/mbti-test/mbti-test.thunk';
import { convertToDateTime } from '../../utils/time.helper';
import MbtiTestDrawerCmp, { MbtiTestDrawerContent } from './components/MbtiTestDrawerCmp';
import styles from './MbtiTestPage.module.scss';

type MbtiTestTableHeaderItemProps = TableHeaderItemProps & { label?: MbtiTestSortBy };

const MbtiTestPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isOpen: isOpenDrawer, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
    const mbtiTypeRef = useRef<HTMLSelectElement>(null);
    const processingStateRef = useRef<HTMLSelectElement>(null);

    /* State */
    const [modalContent, setModalContent] = useState<MbtiTestDrawerContent>();
    const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { token } = useSelector((state: RootState) => state.auth);
    const { loading, mbtiTests, totalPage, currentPage, queryFilter, searchProfiles, searchLoading } = useSelector(
        (state: RootState) => state.mbtiTest,
    ) as MbtiTestState;

    /* Setup */
    const listTableHeader: MbtiTestTableHeaderItemProps[] = [
        { name: '#', isSortable: false },
        { name: 'Người thực hiện', isSortable: false },
        { name: 'Số câu trả lời', isSortable: false },
        { name: 'Kết quả', isSortable: false },
        { name: 'Trạng thái', isSortable: false },
        { name: 'Thời gian tạo', isSortable: true, orderBy: queryFilter.orderBy, label: 'createdAt', center: true },
        { name: '', isSortable: false },
    ];

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchMbtiTestsThunk(initialMbtiTestQueryFilter));
        return () => {
            dispatch(resetMbtiTestState());
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
            fetchMbtiTestsThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };

    const sortHandler = (sortBy?: MbtiTestSortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchMbtiTestsThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    const searchHandler = () => {
        const mbtiTypeValue = mbtiTypeRef.current?.value
            ? MBTI_TYPE[mbtiTypeRef.current?.value as keyof typeof MBTI_TYPE]
            : undefined;
        const processingStateValue = processingStateRef.current?.value
            ? MBTI_PROCESSING_STATE[processingStateRef.current?.value as keyof typeof MBTI_PROCESSING_STATE]
            : undefined;
        dispatch(
            fetchMbtiTestsThunk({
                ...initialMbtiTestQueryFilter,
                processingState: processingStateValue,
                mbtiType: mbtiTypeValue,
                owner: selectedOwnerIds[0],
            }),
        );
    };

    return (
        <>
            {/* Modal */}
            <MbtiTestDrawerCmp
                content={modalContent as MbtiTestDrawerContent}
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
                            placeholder="Tìm theo người thực hiện"
                            emptyRecordMsg={
                                search ? 'Không có hồ sơ phù hợp dựa trên tìm kiếm' : 'Nhập tên, nickname hoặc username...'
                            }
                            hidePlaceholder={selectedOwnerIds.length > 0}
                            avoidHighlightFirstOption={true}
                            selectionLimit={1}
                            showCheckbox={true}
                            showArrow={true}
                            options={searchProfiles}
                            loading={searchLoading}
                            onSearch={handleSearch}
                            onSelect={(profiles: ProfileSearchDTO[]) => {
                                setSelectedOwnerIds(profiles.map((profile) => profile.id));
                            }}
                            onRemove={(profiles: ProfileSearchDTO[]) => {
                                setSelectedOwnerIds(profiles.map((profile) => profile.id));
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
                    <Select background="white" placeholder="Nhóm tính cách" width="25%" ref={mbtiTypeRef}>
                        {Object.entries(mbtiTypeDisplayer).map(([key, value]) => (
                            <option key={key} value={key}>
                                {key} - {value.displayer}
                            </option>
                        ))}
                    </Select>
                    <Select background="white" placeholder="Trạng thái" width="25%" ref={processingStateRef}>
                        {Object.entries(mbtiProcessingStateDisplayer).map(([key, value]) => (
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
                        Danh sách bài kiểm tra tính cách
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
                                {!loading && mbtiTests.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && mbtiTests.length > 0 && (
                                    <>
                                        {mbtiTests.map((test, i) => {
                                            return (
                                                <Tr key={test.id} fontSize="md" fontWeight="medium">
                                                    <Td>{i + 1}</Td>
                                                    <Td>
                                                        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                            <Avatar
                                                                name={test.owner.name}
                                                                src={test.owner.avatar || undefined}
                                                                w="50px"
                                                                borderRadius="12px"
                                                                me="18px"
                                                            />
                                                            <Flex direction="column" gap="5px">
                                                                <Text fontSize="md" fontWeight="bold" minWidth="100%">
                                                                    {test.owner.name}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                                    {test.owner.username}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        {test.answerCount} / {Object.keys(mbtiQuestionsDisplayer).length}
                                                    </Td>
                                                    <Td>
                                                        {test.result && (
                                                            <Badge
                                                                bg={
                                                                    mbtiCategoryDisplayer[
                                                                        mbtiTypeDisplayer[test.result.type]?.category
                                                                    ]?.bgColor
                                                                }
                                                                color="white"
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                borderRadius="8px">
                                                                {test.result.type} - {mbtiTypeDisplayer[test.result.type]?.displayer}
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        {test.processingState && (
                                                            <Badge
                                                                bgColor={mbtiProcessingStateDisplayer[test.processingState]?.color}
                                                                color="white"
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                borderRadius="8px">
                                                                {mbtiProcessingStateDisplayer[test.processingState]?.displayer}
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td textAlign="center">{convertToDateTime(test.createdAt)}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            <Button
                                                                colorScheme="facebook"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({ id: test.id });
                                                                    openDrawer();
                                                                }}>
                                                                Chi tiết
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
                {!loading && mbtiTests.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default MbtiTestPage;
