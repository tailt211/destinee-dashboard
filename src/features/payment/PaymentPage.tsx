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
    Wrap,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ORDER_BY } from '../../model/order-by.enum';
import PaginationCmp from '../../shared/PaginationCmp';
import TableHeaderItemCmp, { TableHeaderItemProps } from '../../shared/TableHeaderItemCmp';
import { AppDispatch, RootState } from '../../store';
import { convertToDateTime } from '../../utils/time.helper';
import { fetchPaymentsThunk } from '../../store/payment/payment.thunk';
import {
    PaymentState,
    initialQueryFilter as initialPaymentQueryFilter,
    resetState as resetPaymentState,
} from '../../store/payment/payment.slice';
import { PaymentSortBy } from '../../model/payment/payment-query-filter';
import { PAYMENT_STATUS } from '../../model/payment/payment-status.enum';
import { GATEWAY_LABEL, paymentStatusDisplayer, PAYMENT_STATUS_LABEL } from '../../model/payment/payment-status-displayer';
import { GATEWAY, gatewayDispayer } from '../../model/payment/gateway.enum';
import PaymentDrawerCmp, { PaymentDrawerContent } from './components/PaymentDrawerCmp';
import OrderDrawerCmp, { OrderDrawerContent } from '../order/components/OrderDrawerCmp';
import { formatMonney } from '../../utils/currency.helper';

type OrderTableHeaderItemProps = TableHeaderItemProps & { label?: PaymentSortBy };

const PaymentPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { isOpen: isOpenOrderDrawer, onOpen: openOrderDrawer, onClose: closeOrderDrawer } = useDisclosure();
    const { isOpen: isOpenPaymentDrawer, onOpen: openPaymentDrawer, onClose: closePaymentDrawer } = useDisclosure();
    const statusRef = useRef<HTMLSelectElement>(null);
    const gatewayRef = useRef<HTMLSelectElement>(null);

    /* State */
    const [modalContent, setModalContent] = useState<PaymentDrawerContent>();

    const { token } = useSelector((state: RootState) => state.auth);

    const { loading, payments, totalPage, currentPage, queryFilter } = useSelector(
        (state: RootState) => state.payment,
    ) as PaymentState;

    /* Setup */
    const listTableHeader: OrderTableHeaderItemProps[] = [
        { name: 'ID', isSortable: false },
        { name: 'Cổng thanh toán', isSortable: false },
        { name: 'Mô tả', isSortable: false },
        { name: 'Tổng tiền', isSortable: true, orderBy: queryFilter.orderBy, label: 'amount' },
        { name: 'Trạng thái', isSortable: false },
        { name: 'Thời gian tạo', isSortable: true, orderBy: queryFilter.orderBy, label: 'createdAt', center: true },
        { name: '', isSortable: false },
    ];

    /* Effect */
    useEffect(() => {
        if (token) dispatch(fetchPaymentsThunk(initialPaymentQueryFilter));
        return () => {
            dispatch(resetPaymentState());
        };
    }, [dispatch, token]);

    /* Handler */
    const paginationHandler = (event: any) => {
        dispatch(
            fetchPaymentsThunk({
                ...queryFilter,
                page: event.selected + 1,
            }),
        );
    };

    const sortHandler = (sortBy?: PaymentSortBy) => {
        const orderBy =
            queryFilter.sortBy === sortBy
                ? queryFilter.orderBy === ORDER_BY.DESC
                    ? ORDER_BY.ASC
                    : ORDER_BY.DESC
                : ORDER_BY.DESC;
        dispatch(
            fetchPaymentsThunk({
                ...queryFilter,
                page: 1,
                orderBy,
                sortBy,
            }),
        );
    };

    const searchHandler = () => {
        const statusValue = statusRef.current?.value
            ? PAYMENT_STATUS[statusRef.current?.value as keyof typeof PAYMENT_STATUS]
            : undefined;
        const gatewayValue = gatewayRef.current?.value
            ? GATEWAY[gatewayRef.current?.value as keyof typeof GATEWAY]
            : undefined;
        dispatch(
            fetchPaymentsThunk({
                ...initialPaymentQueryFilter,
                status: statusValue,
                gateway: gatewayValue,
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
                    <Select background="white" placeholder={GATEWAY_LABEL} width="25%" ref={gatewayRef}>
                        {Object.entries(gatewayDispayer).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.displayer}
                            </option>
                        ))}
                    </Select>
                    <Select background="white" placeholder={PAYMENT_STATUS_LABEL} width="25%" ref={statusRef}>
                        {Object.entries(paymentStatusDisplayer).map(([key, value]) => (
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
                        Danh sách lịch sử thanh toán
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
                                {!loading && payments.length <= 0 && (
                                    <Tr>
                                        <Td colSpan={listTableHeader.length} textAlign="center" fontWeight="bold">
                                            Không có thông tin để hiển thị
                                        </Td>
                                    </Tr>
                                )}
                                {!loading && payments.length > 0 && (
                                    <>
                                        {payments.map((payment) => {
                                            return (
                                                <Tr key={payment.id} fontSize="md" fontWeight="medium">
                                                    <Td whiteSpace="nowrap">
                                                        {payment.id}
                                                    </Td>
                                                    <Td>
                                                        {payment.gateway}
                                                    </Td>
                                                    <Td>
                                                        {payment.description}
                                                    </Td>
                                                    <Td>
                                                        {payment.amount && (
                                                            <Badge
                                                                borderRadius={6}
                                                                py={0.5}
                                                                px={1}
                                                                fontWeight="medium"
                                                                fontSize={13}
                                                                textTransform="lowercase">
                                                                {formatMonney(payment.amount)} đ
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td>
                                                        {payment.status && (
                                                            <Badge
                                                                colorScheme={
                                                                    paymentStatusDisplayer[payment.status]?.colorScheme
                                                                }
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                variant="solid"
                                                                borderRadius="6">
                                                                {paymentStatusDisplayer[payment.status]?.displayer}
                                                            </Badge>
                                                        )}
                                                    </Td>
                                                    <Td textAlign="center">{convertToDateTime(payment.createdAt)}</Td>
                                                    <Td>
                                                        <Wrap spacing={3}>
                                                            <Button
                                                                colorScheme="whatsapp"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setModalContent({ id: payment.orderId });
                                                                    openOrderDrawer();
                                                                }}>
                                                                Chi tiết đơn hàng
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                colorScheme="messenger"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setModalContent({ id: payment.id });
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
                {!loading && payments.length > 0 && (
                    <PaginationCmp totalPage={totalPage} onPageClick={paginationHandler} selectedPage={currentPage - 1} />
                )}
            </Stack>
        </>
    );
};

export default PaymentPage;
