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
import { ORDER_BY } from '../../model/order-by.enum';
import { ProfileSearchDTO } from '../../model/profile/dto/profile-search.dto';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import { convertToDateTime } from '../../utils/time.helper';
import styles from './OrderPage.module.scss';
import {
    OrderState,
    initialQueryFilter as initialOrderQueryFilter,
    resetState as resetOrderState,
} from '../../store/order/order.slice';
import { fetchOrdersThunk, fetchSearchProfilesThunk } from '../../store/order/oder.thunk';
import { orderStatusDisplayer, ORDER_STATUS_LABEL } from '../../model/order/order-status-displayer';
import { ORDER_STATUS } from '../../model/order/order-status.enum';
import { OrderSortBy } from '../../model/order/order-query-filter';
import OrderDrawerCmp, { OrderDrawerContent } from './components/OrderDrawerCmp';
import PaymentDrawerCmp, { PaymentDrawerContent } from '../payment/components/PaymentDrawerCmp';
import { formatMonney } from '../../utils/currency.helper';

type OrderTableHeaderItemProps = TableHeaderItemProps & { label?: OrderSortBy };

const OrderPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isOpen: isOpenOrderDrawer, onOpen: openOrderDrawer, onClose: closeOrderDrawer } = useDisclosure();
    const { isOpen: isOpenPaymentDrawer, onOpen: openPaymentDrawer, onClose: closePaymentDrawer } = useDisclosure();
    const statusRef = useRef<HTMLSelectElement>(null);

    /* State */
    const [modalContent, setModalContent] = useState<OrderDrawerContent>();
    const [selectedOwnerIds, setSelectedOwnerIds] = useState<string[]>([]);
    const [search, setSearch] = useState<string>('');

    const { token } = useSelector((state: RootState) => state.auth);

    const { loading, orders, totalPage, currentPage, queryFilter, searchProfiles, searchLoading } = useSelector(
        (state: RootState) => state.order,
    ) as OrderState;

    /* Setup */
    const listTableHeader: OrderTableHeaderItemProps[] = [
        { name: 'ID', isSortable: false },
        { name: 'Tên', isSortable: false },
        { name: 'Mô tả', isSortable: false },
        { name: 'Tổng tiền', isSortable: true, orderBy: queryFilter.orderBy, label: 'totalPrice' },
        { name: 'Trạng thái', isSortable: false },
        { name: 'Thời gian tạo', isSortable: true, orderBy: queryFilter.orderBy, label: 'createdAt', center: true },
        { name: '', isSortable: false },
    ];

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchOrdersThunk(initialOrderQueryFilter));
        return () => {
            dispatch(resetOrderState());
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
            fetchOrdersThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };

    const sortHandler = (sortBy?: OrderSortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchOrdersThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    const searchHandler = () => {
        const statusValue = statusRef.current?.value
            ? ORDER_STATUS[statusRef.current?.value as keyof typeof ORDER_STATUS]
            : undefined;
        dispatch(
            fetchOrdersThunk({
                ...initialOrderQueryFilter,
                status: statusValue,
                owner: selectedOwnerIds[0],
            }),
        );
    };

    return (
        <>
            {/* Modal */}
            <OrderDrawerCmp
                content={modalContent as OrderDrawerContent}
                isOpen={isOpenOrderDrawer}
                onClose={() => {
                    setModalContent(undefined);
                    closeOrderDrawer();
                }}
            />
            <PaymentDrawerCmp
                content={modalContent as PaymentDrawerContent}
                isOpen={isOpenPaymentDrawer}
                onClose={() => {
                    setModalContent(undefined);
                    closePaymentDrawer();
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
                    <Select background="white" placeholder={ORDER_STATUS_LABEL} width="25%" ref={statusRef}>
                        {Object.entries(orderStatusDisplayer).map(([key, value]) => (
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
                        Danh sách đơn hàng
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
                                {!loading && orders.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && orders.length > 0 && (
                                    <>
                                        {orders.map((order) => {
                                            return (
                                                <Tr key={order.id} fontSize="md" fontWeight="medium">
                                                    <Td whiteSpace="nowrap">
                                                        {order.id}
                                                    </Td>
                                                    <Td>
                                                        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                                            <Avatar
                                                                name={order.owner.name}
                                                                src={order.owner.avatarUrl || undefined}
                                                                w="50px"
                                                                borderRadius="12px"
                                                                me="18px"
                                                            />
                                                            <Flex direction="column" gap="5px">
                                                                <Text fontSize="md" fontWeight="bold" minWidth="100%">
                                                                    {order.owner.name}
                                                                </Text>
                                                                <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                                    {order.owner.username}
                                                                </Text>
                                                            </Flex>
                                                        </Flex>
                                                    </Td>
                                                    <Td>
                                                        {order.description}
                                                    </Td>
                                                    <Td>
                                                        {order.totalPrice && (
                                                            <Badge
                                                                borderRadius={6}
                                                                py={0.5}
                                                                px={1}
                                                                fontWeight="medium"
                                                                fontSize={13}
                                                                textTransform="lowercase">
                                                                {formatMonney(order.totalPrice)} đ
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        <Badge
                                                            colorScheme={
                                                                orderStatusDisplayer[order.status]?.colorScheme
                                                            }
                                                            p="3px 10px"
                                                            fontWeight="medium"
                                                            variant="solid"
                                                            borderRadius="6">
                                                            {orderStatusDisplayer[order.status]?.displayer}
                                                        </Badge>
                                                    </Td>
                                                    <Td textAlign="center">{convertToDateTime(order.createdAt)}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            <Button
                                                                colorScheme="whatsapp"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({ id: order.id });
                                                                    openOrderDrawer();
                                                                }}>
                                                                Chi tiết đơn hàng
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                colorScheme="messenger"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setModalContent({ id: order.paymentId });
                                                                    openPaymentDrawer();
                                                                }}>
                                                                Chi tiết giao dịch
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
                {!loading && orders.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default OrderPage;
