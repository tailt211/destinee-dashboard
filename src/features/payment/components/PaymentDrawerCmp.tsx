import {
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
    HStack,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AiOutlineBank, AiOutlineCreditCard, AiOutlineNumber, AiOutlineTransaction } from 'react-icons/ai';
import { FaAudioDescription, FaBarcode, FaRegAddressCard } from 'react-icons/fa';
import { IoIosCash, IoIosTimer, IoMdPersonAdd } from 'react-icons/io';
import { MdAttachMoney, MdDateRange, MdPowerSettingsNew } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { paymentStatusDisplayer } from '../../../model/payment/payment-status-displayer';
import { VnpayOrderTypeDisplayer, VnpayPayResp } from '../../../model/payment/vnpay-resp-displayer';
import { AppDispatch, RootState } from '../../../store';
import {
    PaymentState,
    resetDrawer as resetPaymentState,
} from '../../../store/payment/payment.slice';
import { fetchPaymentThunk } from '../../../store/payment/payment.thunk';
import { formatMonney } from '../../../utils/currency.helper';
import { convertToDateTime } from '../../../utils/time.helper';

export interface PaymentDrawerContent {
    id: string;
}

const PaymentDrawerCmp: React.FC<{
    content?: PaymentDrawerContent;
    isOpen: boolean;
    onClose: () => void;
}> = ({ content, isOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { drawerLoading, payment } = useSelector((state: RootState) => state.payment) as PaymentState;

    /* Effect */
    useEffect(() => {
        if (isOpen && content?.id) dispatch(fetchPaymentThunk(content.id));
    }, [dispatch, isOpen, content?.id]);

    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetPaymentState());
        onClose();
    };
    return (
        <Drawer isOpen={isOpen} placement="right" size="md" closeOnOverlayClick={true} onClose={closeDrawerHandler}>
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
                    {!drawerLoading && payment && (
                        <>
                            <Box bgColor="blackAlpha.200" py={3} pl={3} alignItems="start" borderRadius="lg">
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={AiOutlineNumber} color="teal" />
                                        ID: <b>{payment.id}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={AiOutlineCreditCard} color="teal" />
                                        Cổng thanh toán: <b>{payment.gateway}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FaAudioDescription} color="teal" />
                                        Mô tả: <b>{payment.description}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosCash} color="teal" />
                                        Tổng tiền:{' '}
                                        <Badge
                                            borderRadius={6}
                                            py={0.5} px={1.5}
                                            fontWeight="medium"
                                            fontSize={13}
                                            textTransform="lowercase">
                                            {formatMonney(payment.amount)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdAttachMoney} color="teal" />
                                        Đơn vị: <b>{payment.currency}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPowerSettingsNew} color="teal" />
                                        Trạng thái:{' '}
                                        <Badge
                                            colorScheme={paymentStatusDisplayer[payment.status]?.colorScheme}
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6">
                                            {paymentStatusDisplayer[payment.status]?.displayer}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày tạo:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertToDateTime(payment.createdAt)}
                                        </Badge>
                                    </ListItem>
                                </List>
                            </Box>
                            <Divider mt={5} mb={2} />
                            <Text fontSize="xl" fontWeight="medium">
                                Thông tin giao dịch tại VNPay
                            </Text>
                            <HStack spacing={3} alignItems="flex-start" justifyContent="space-between">
                                <List minW="380px" w="full" py={3} px={4} borderRadius="lg" boxShadow="2xl" spacing={3}>
                                    <ListItem>
                                        <ListIcon as={AiOutlineNumber} color="teal" />
                                        txnRef: <b>{payment.vnpayData.txnRef}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosCash} color="teal" />
                                        Số tiền: <b>{formatMonney(payment.vnpayData.amount / 100)}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdAttachMoney} color="teal" />
                                        Đơn vị: <b>{payment.vnpayData.currency}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={AiOutlineBank} color="teal" />
                                        bankCode: <b>{payment.vnpayData.bankCode}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={AiOutlineTransaction} color="teal" />
                                        bankTransNo: <b>{payment.vnpayData.bankTransNo}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoMdPersonAdd} color="teal" />
                                        Loại thanh toán: <b>{VnpayOrderTypeDisplayer[payment.vnpayData.orderType]?.dispayler}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={AiOutlineCreditCard} color="teal" />
                                        CardType: <b>{payment.vnpayData.cardType}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FaRegAddressCard} color="teal" />
                                        ipAddr: <b>{payment.vnpayData.ipAddr}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày tạo: <b>{convertToDateTime(payment.vnpayData.createdDate)}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosTimer} color="teal" />
                                        Ngày hết hạn: <b>{convertToDateTime(payment.vnpayData.expireDate)}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày thanh toán: <b>{convertToDateTime(payment.vnpayData.payDate)}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FaBarcode} color="teal" />
                                        respCode: {payment.vnpayData.respCode} {' - '}
                                        <Badge
                                            colorScheme={
                                                VnpayPayResp[payment.vnpayData.respCode].success
                                                    ? 'dGreen' : 'dDanger'
                                            }
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6"
                                            whiteSpace='normal'>
                                            {VnpayPayResp[payment.vnpayData.respCode].description}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPowerSettingsNew} color="teal" />
                                        Status: <b>{payment.vnpayData.status}</b>
                                    </ListItem>
                                </List>
                            </HStack>
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

export default PaymentDrawerCmp;
