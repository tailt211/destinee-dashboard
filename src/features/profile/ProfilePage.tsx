import {
    Avatar,
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
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../model/account/status-displayer';
import { mbtiCategoryDisplayer } from '../../model/mbti-test/mbti-category-displayer';
import { mbtiTypeDisplayer } from '../../model/mbti-test/mbti-type-displayer';
import { MBTI_TYPE } from '../../model/mbti-test/mbti-type.enum';
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSortBy } from '../../model/profile/profile-query-filter';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import {
    clearError as clearProfileError,
    initialQueryFilter as initialProfileQueryFilter,
    resetState as resetProfileState,
} from '../../store/profile/profile.slice';
import { fetchProfilesThunk } from '../../store/profile/profile.thunk';
import { getPercentage } from '../../utils/number.helper';
import { convertSecondToHHMMSS, convertToDateTime } from '../../utils/time.helper';
import ProfileDrawerCmp, { ProfileDrawerContent } from './component/ProfileDrawerCmp';
import AccountDrawerCmp, { ProfileViewAccountDrawerContent } from './component/ProfileViewAccountDrawerCmp';

type ProfileTableHeaderItemProps = TableHeaderItemProps & { label?: ProfileSortBy };

const ProfilePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    /* Drawer */
    const [drawerContent, setDrawerContent] = useState<ProfileDrawerContent | ProfileViewAccountDrawerContent>();
    const { isOpen: isOpenProfileDrawer, onOpen: openProfileDrawer, onClose: closeProfileDrawer } = useDisclosure();
    const { isOpen: isOpenAccountDrawer, onOpen: openAccountDrawer, onClose: closeAccountDrawer } = useDisclosure();
    /* Ref */
    const searchRef = useRef<HTMLInputElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const mbtiTypeRef = useRef<HTMLSelectElement>(null);
    /* State */
    const { loading, error, profiles, currentPage, totalPage, queryFilter } = useSelector((state: RootState) => state.profile);
    const { token } = useSelector((state: RootState) => state.auth);
    /* Handler */
    const paginationHandler = (event: any) => {
        dispatch(
            fetchProfilesThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };
    /* Toast */
    const profileToast = useToast({ isClosable: true, duration: 1500, title: 'Hồ sơ tài khoản' });

    /* Handler */
    const searchHandler = (event: any) => {
        event.preventDefault();
        if (!token) return;
        const mbtiTypeValue = mbtiTypeRef.current?.value
            ? MBTI_TYPE[mbtiTypeRef.current?.value as keyof typeof MBTI_TYPE]
            : undefined;
        const status = statusRef.current?.value !== '' ? (statusRef.current?.value === 'true' ? true : false) : undefined;
        dispatch(
            fetchProfilesThunk({
                ...initialProfileQueryFilter,
                search: searchRef.current?.value?.trim(),
                disabled: status,
                mbtiType: mbtiTypeValue,
            }),
        );
    };

    const sortHandler = (sortBy?: ProfileSortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchProfilesThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchProfilesThunk(initialProfileQueryFilter));
        return () => {
            dispatch(resetProfileState());
        };
    }, [dispatch, token]);

    useEffect(() => {
        if (!error) return;
        profileToast({
            description: error,
            status: 'error',
            onCloseComplete: () => {
                dispatch(clearProfileError());
            },
        });
    }, [error, profileToast, dispatch]);

    /* Table Header */
    const listTableHeader: ProfileTableHeaderItemProps[] = useMemo(
        () => [
            { name: '#', isSortable: false },
            { name: 'Tên', isSortable: false },
            { name: 'Số cuộc gọi', isSortable: true, label: 'callCount', orderBy: queryFilter.orderBy },
            {
                name: 'Thời lượng gọi',
                isSortable: true,
                label: 'callDuration',
                orderBy: queryFilter.orderBy,
            },
            {
                name: 'Thời lượng mỗi cuộc gọi',
                isSortable: true,
                label: 'meanCallDuration',
                orderBy: queryFilter.orderBy,
            },
            {
                name: 'Tỉ lệ hủy hàng chờ',
                isSortable: true,
                label: 'droppedQueueRatio',
                orderBy: queryFilter.orderBy,
            },
            {
                name: 'Được đánh giá',
                isSortable: true,
                label: 'ratedRatio',
                orderBy: queryFilter.orderBy,
            },
            { name: 'Đánh giá', isSortable: true, label: 'ratingRatio', orderBy: queryFilter.orderBy },
            { name: 'MBTI', isSortable: false },
            { name: 'Trạng thái', isSortable: false },
            { name: 'Ngày tạo', isSortable: true, label: 'createdAt', orderBy: queryFilter.orderBy },
            { name: '', isSortable: false },
        ],
        [queryFilter.orderBy],
    );

    return (
        <>
            {/* Modal */}
            <ProfileDrawerCmp
                isOpen={isOpenProfileDrawer}
                onClose={() => {
                    setDrawerContent(undefined);
                    closeProfileDrawer();
                }}
                content={drawerContent as ProfileDrawerContent}
            />
            <AccountDrawerCmp
                isOpen={isOpenAccountDrawer}
                onClose={() => {
                    setDrawerContent(undefined);
                    closeAccountDrawer();
                }}
                toast={profileToast}
                content={drawerContent as ProfileViewAccountDrawerContent}
            />
            {/* Content */}
            <Stack spacing={4}>
                <form onSubmit={searchHandler}>
                    <Flex gap="2" width="100%">
                        <InputGroup background="white" borderRadius="lg" width="100%">
                            <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                            <Input type="text" placeholder="Tìm theo tên, username" ref={searchRef} />
                        </InputGroup>
                        <Select background="white" placeholder="Nhóm tính cách" width="25%" ref={mbtiTypeRef}>
                            {Object.entries(mbtiTypeDisplayer).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {key} - {value.displayer}
                                </option>
                            ))}
                        </Select>
                        <Select background="white" placeholder="Trạng thái" width="25%" minW="120px" ref={statusRef}>
                            <option value="false">{statusDisplayer(false)?.displayer}</option>
                            <option value="true">{statusDisplayer(true)?.displayer}</option>
                        </Select>
                        <Button colorScheme="teal" onClick={searchHandler} type="submit" minWidth="40px">
                            Tìm kiếm
                        </Button>
                    </Flex>
                </form>

                <Box borderRadius="lg" background="white" padding="22px">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" fontWeight="bold" color="black">
                            Danh sách hồ sơ tài khoản
                        </Text>
                        {/* <Button
                            colorScheme="teal"
                            leftIcon={<TiPlus />}
                            size="md"
                            fontWeight="bold"
                            variant="outline"
                            onClick={openAccountCreateModal}>
                            Tạo tài khoản
                        </Button> */}
                    </Flex>
                    <Box overflowX="scroll" mt={5}>
                        <Table variant="striped">
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
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
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
                                {!loading && profiles.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && profiles.length > 0 && (
                                    <>
                                        {profiles.map((profile, index) => {
                                            return (
                                                <Tr key={profile.id} fontSize="md" fontWeight="medium">
                                                    <Td>{index + 1}</Td>
                                                    <Td>
                                                        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                            <Avatar
                                                                name={profile.name}
                                                                src={profile.avatar}
                                                                w="50px"
                                                                borderRadius="12px"
                                                                me="18px"
                                                            />
                                                            <Flex direction="column" gap="5px">
                                                                <Text fontSize="md" fontWeight="bold" minWidth="100%">
                                                                    {profile.name}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                                    {profile.username}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Td>
                                                    <Td>{profile.callCount}</Td>
                                                    <Td>{convertSecondToHHMMSS(profile.callDuration)}</Td>
                                                    <Td>{convertSecondToHHMMSS(profile.meanCallDuration)}</Td>
                                                    <Td>{getPercentage(profile.droppedQueueRatio)}%</Td>
                                                    <Td minW="120px">{`${Number(profile.ratedRatio).toFixed(2)} / 5 ★`}</Td>
                                                    <Td minW="120px">{`${Number(profile.ratingRatio).toFixed(2)} / 5 ★`}</Td>
                                                    <Td>
                                                        {profile.mbtiResult?.type && (
                                                            <Badge
                                                                bg={
                                                                    mbtiCategoryDisplayer[
                                                                        mbtiTypeDisplayer[profile.mbtiResult.type]?.category
                                                                    ].bgColor
                                                                }
                                                                color="white"
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                borderRadius="8px">
                                                                {profile.mbtiResult.type} -{' '}
                                                                {mbtiTypeDisplayer[profile.mbtiResult.type]?.displayer}
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={statusDisplayer(profile.disabled!)?.color}
                                                            p="3px 10px"
                                                            fontWeight="medium"
                                                            variant="solid"
                                                            borderRadius="6">
                                                            {statusDisplayer(profile.disabled!)?.displayer}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{convertToDateTime(profile.createdAt, 'date')}</Td>
                                                    <Td>
                                                        <Flex gap="10px" w="100%" direction="column">
                                                            <Button
                                                                size="sm"
                                                                colorScheme="whatsapp"
                                                                variant="outline"
                                                                w="100%"
                                                                onClick={() => {
                                                                    setDrawerContent({
                                                                        id: profile.id,
                                                                    } as ProfileDrawerContent);
                                                                    openProfileDrawer();
                                                                }}>
                                                                Xem chi tiết hồ sơ
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                colorScheme="messenger"
                                                                variant="outline"
                                                                w="100%"
                                                                onClick={() => {
                                                                    setDrawerContent({
                                                                        accountId: profile.accountId,
                                                                        disabled: !profile.disabled,
                                                                    } as ProfileViewAccountDrawerContent);
                                                                    openAccountDrawer();
                                                                }}>
                                                                Xem chi tiết tài khoản
                                                            </Button>
                                                        </Flex>
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
                {!loading && profiles.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default ProfilePage;
