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
import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TiPlus } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { roleDisplayer, ROLE_LABEL } from '../../model/account/role-displayer';
import { ROLE } from '../../model/account/roles.enum';
import { statusDisplayer } from '../../model/account/status-displayer';
import { ORDER_BY } from '../../model/order-by.enum';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import {
    AccountState,
    clearError as clearAccountError,
    initialQueryFilter as initialAccountQueryFilter,
    resetState as resetAccountState,
} from '../../store/account/account.slice';
import { fetchAccountsThunk } from '../../store/account/account.thunk';
import { AuthState } from '../../store/auth/auth.slice';
import { convertToDateTime } from '../../utils/time.helper';
import ProfileDrawerCmp, { ProfileDrawerContent } from '../profile/component/ProfileDrawerCmp';
import AccountPasswordChangeModalCmp, { AccountPasswordChangeModalContent } from './components/AccountChangePasswordModalCmp';
import AccountCreateModalCmp from './components/AccountCreateModal';
import AccountStatusChangeModalCmp, { AccountStatusChangeModalContent } from './components/AccountStatusChangeModalCmp';

const AccountPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const {
        isOpen: isOpenPasswordChangeModal,
        onOpen: openPasswordChangeModal,
        onClose: closePasswordChangeModal,
    } = useDisclosure();
    const { isOpen: isOpenStatusModal, onOpen: openStatusModalModal, onClose: closeStatusModal } = useDisclosure();
    const { isOpen: isOpenProfileDrawer, onOpen: onOpenProfileDrawer, onClose: onCloseProfileDrawer } = useDisclosure();
    const {
        isOpen: isOpenAccountCreateModal,
        onOpen: openAccountCreateModal,
        onClose: closeAccountCreateModal,
    } = useDisclosure();
    const searchRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLSelectElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const accountToast = useToast({ isClosable: true, duration: 1500, title: 'Tài khoản' });

    /* State */
    const { loading, error, accounts, totalPage, currentPage, queryFilter } = useSelector(
        (state: RootState) => state.account,
    ) as AccountState;
    const { token, myAccount } = useSelector((state: RootState) => state.auth) as AuthState;
    const [modalContent, setModalContent] = useState<
        AccountPasswordChangeModalContent | AccountStatusChangeModalContent | ProfileDrawerContent
    >();

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchAccountsThunk(initialAccountQueryFilter));
        return () => {
            dispatch(resetAccountState());
        };
    }, [dispatch, token]);

    useEffect(() => {
        if (!error) return;
        accountToast({
            description: error,
            status: 'error',
            onCloseComplete: () => {
                dispatch(clearAccountError());
            },
        });
    }, [error, accountToast, dispatch]);

    /* Handler */
    const searchHandler = (e: any) => {
        e.preventDefault();
        const roleValue = roleRef.current?.value ? ROLE[roleRef.current?.value as keyof typeof ROLE] : undefined;
        const status = statusRef.current?.value !== '' ? (statusRef.current?.value === 'true' ? true : false) : undefined;
        dispatch(fetchAccountsThunk({ ...initialAccountQueryFilter, search: searchRef.current?.value?.trim(), role: roleValue, disabled: status}));
    };

    const paginationHandler = (event: any) => {
        dispatch(
            fetchAccountsThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };

    const sortHandler = () => {
        dispatch(
            fetchAccountsThunk({
                ...queryFilter,
                page: 1,
                orderBy: queryFilter.orderBy === ORDER_BY.DESC ? ORDER_BY.ASC : ORDER_BY.DESC,
            }),
        );
    };

    const refreshHandler = () => {
        fetchAccountsThunk(initialAccountQueryFilter);
    };

    const listTableHeader: TableHeaderItemProps[] = [
        { label: 'title', name: 'ID', isSortable: false },
        { label: 'email', name: 'Email', isSortable: false },
        { label: 'role', name: ROLE_LABEL, isSortable: false },
        { label: 'disabled', name: 'Trạng thái', isSortable: false },
        { label: 'createdAt', name: 'Ngày tạo', isSortable: true, orderBy: queryFilter.orderBy, sortHandler },
        { name: '', isSortable: false },
    ];

    return (
        <>
            {/* Modal */}
            <AccountPasswordChangeModalCmp
                content={modalContent as AccountPasswordChangeModalContent}
                isOpen={isOpenPasswordChangeModal}
                onClose={closePasswordChangeModal}
                toast={accountToast}
            />
            <AccountStatusChangeModalCmp
                isOpen={isOpenStatusModal}
                onClose={closeStatusModal}
                content={modalContent as AccountStatusChangeModalContent}
                toast={accountToast}
            />
            <AccountCreateModalCmp
                isOpen={isOpenAccountCreateModal}
                onClose={closeAccountCreateModal}
                refresh={refreshHandler}
                toast={accountToast}
            />
            <ProfileDrawerCmp
                isOpen={isOpenProfileDrawer}
                onClose={() => {
                    onCloseProfileDrawer();
                    setModalContent(undefined);
                }}
                content={modalContent as ProfileDrawerContent}
            />
            {/* Content */}
            <Stack spacing={4}>
                <form onSubmit={searchHandler}>
                    <Flex gap="2" width="100%">
                        <InputGroup background="white" borderRadius="lg" width="100%">
                            <InputLeftElement pointerEvents="none" children={<FaSearch color="gray.300" />} />
                            <Input type="text" placeholder="Tìm kiếm theo email..." ref={searchRef} />
                        </InputGroup>
                        <Select background="white" placeholder={ROLE_LABEL} width="25%" minW="120px" ref={roleRef}>
                            {Object.entries(roleDisplayer).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value.displayer}
                                </option>
                            ))}
                        </Select>
                        <Select background="white" placeholder="Trạng thái" width="25%" minW="120px" ref={statusRef}>
                            <option value="false">{statusDisplayer(false).displayer}</option>
                            <option value="true">{statusDisplayer(true).displayer}</option>
                        </Select>
                        <Button colorScheme="teal" px="10" onClick={searchHandler} type="submit">
                            Tìm kiếm
                        </Button>
                    </Flex>
                </form>

                <Box borderRadius="lg" background="white" padding="22px">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontSize="xl" fontWeight="bold" color="black">
                            Danh sách tài khoản
                        </Text>
                        <Button
                            colorScheme="teal"
                            leftIcon={<TiPlus />}
                            size="md"
                            fontWeight="bold"
                            variant="outline"
                            onClick={openAccountCreateModal}>
                            Tạo tài khoản
                        </Button>
                    </Flex>
                    <Box overflowX="scroll" mt="5">
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    {listTableHeader.map((heading, index) => {
                                        return (
                                            <TableHeaderItemCmp
                                                key={index}
                                                isSortable={heading.isSortable}
                                                orderBy={heading.orderBy}
                                                name={heading.name}
                                                label={heading.label}
                                                sortBy={queryFilter.sortBy}
                                                sortHandler={heading.sortHandler}
                                            />
                                        );
                                    })}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {loading ||
                                    (!loading && accounts.length <= 0 && (
                                        <Tr>
                                            <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                                {loading && (
                                                    <Spinner
                                                        thickness="4px"
                                                        speed="0.65s"
                                                        emptyColor="gray.200"
                                                        color="teal.400"
                                                        size="xl"
                                                    />
                                                )}
                                                {!loading && accounts.length <= 0 && 'Không có thông tin để hiển thị'}
                                            </Td>
                                        </Tr>
                                    ))}
                                {!loading && accounts.length > 0 && (
                                    <>
                                        {accounts.map((account) => {
                                            return (
                                                <Tr key={account.id} fontSize="md" fontWeight="medium">
                                                    <Td>{account.id}</Td>
                                                    <Td fontWeight="bold">{account.email}</Td>
                                                    <Td>
                                                        <Badge
                                                            variant="subtle"
                                                            colorScheme={roleDisplayer[account.role]?.color}
                                                            p="3px 10px"
                                                            fontWeight="medium"
                                                            borderRadius="6">
                                                            {roleDisplayer[account.role]?.displayer}
                                                        </Badge>
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={statusDisplayer(account.disabled)?.color}
                                                            p="3px 10px"
                                                            fontWeight="medium"
                                                            variant="solid"
                                                            borderRadius="6">
                                                            {statusDisplayer(account.disabled)?.displayer}
                                                        </Badge>
                                                    </Td>
                                                    <Td>{convertToDateTime(account.createdAt)}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            {account.profileId && (
                                                                <Button
                                                                    colorScheme="facebook"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setModalContent({
                                                                            id: account.profileId,
                                                                        } as ProfileDrawerContent);
                                                                        onOpenProfileDrawer();
                                                                    }}>
                                                                    Xem hồ sơ tài khoản
                                                                </Button>
                                                            )}
                                                            <Button
                                                                colorScheme="yellow"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({
                                                                        id: account.id,
                                                                        email: account.email,
                                                                    } as AccountPasswordChangeModalContent);
                                                                    openPasswordChangeModal();
                                                                }}>
                                                                Đổi mật khẩu
                                                            </Button>
                                                            {/* <Button
                                                                variant="outline"
                                                                colorScheme="green"
                                                                size="sm"
                                                                disabled={true}>
                                                                Nâng cấp
                                                            </Button> */}
                                                            {myAccount?.id !== account.id && (
                                                                <Button
                                                                    colorScheme={statusDisplayer(!account.disabled)?.colorScheme}
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setModalContent({
                                                                            id: account.id,
                                                                            email: account.email,
                                                                            disabled: account.disabled,
                                                                        } as AccountStatusChangeModalContent);
                                                                        openStatusModalModal();
                                                                    }}>
                                                                    {statusDisplayer(!account.disabled)?.displayer}
                                                                </Button>
                                                            )}
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
                {!loading && accounts.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default AccountPage;
