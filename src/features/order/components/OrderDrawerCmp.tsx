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
    HStack,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AiOutlineNumber } from 'react-icons/ai';
import { IoIosCash } from 'react-icons/io';
import { MdDateRange, MdPerson, MdPowerSettingsNew } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { orderStatusDisplayer } from '../../../model/order/order-status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { fetchOrderThunk } from '../../../store/order/oder.thunk';
import {
    OrderState,
    resetDrawer as resetOrderDrawer
} from '../../../store/order/order.slice';
import { formatMonney } from '../../../utils/currency.helper';
import { convertToDateTime } from '../../../utils/time.helper';

export interface OrderDrawerContent {
    id: string;
}

const OrderDrawerCmp: React.FC<{
    content?: OrderDrawerContent;
    isOpen: boolean;
    onClose: () => void;
}> = ({ content, isOpen, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { drawerLoading, order } = useSelector((state: RootState) => state.order) as OrderState;

    /* Effect */
    useEffect(() => {
        if (isOpen && content?.id) dispatch(fetchOrderThunk(content.id));
    }, [dispatch, isOpen, content?.id]);

    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetOrderDrawer());
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
                    {!drawerLoading && order && (
                        <>
                            <Box bgColor="blackAlpha.200" py={3} pl={3} alignItems="start" borderRadius="lg">
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={AiOutlineNumber} color="teal" />
                                        ID: <b>{order.id}</b>
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
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={IoIosCash} color="teal" />
                                        Tổng tiền:{' '}
                                        <Badge borderRadius={6}
                                            py={0.5}
                                            px={1.5}
                                            fontWeight="medium"
                                            fontSize={13}
                                            textTransform="lowercase">
                                            {formatMonney(order.totalPrice)} đ
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPowerSettingsNew} color="teal" />
                                        Trạng thái:{' '}
                                        <Badge
                                            colorScheme={orderStatusDisplayer[order.status]?.colorScheme}
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6">
                                            {orderStatusDisplayer[order.status]?.displayer}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày tạo:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertToDateTime(order.createdAt)}
                                        </Badge>
                                    </ListItem>
                                </List>
                            </Box>
                            <Divider mt={5} mb={2} />
                            <Text fontSize="xl" fontWeight="medium">
                                Danh sách các gói dịch vụ
                            </Text>
                            <List mt={2} spacing={4}>
                                {order.items.map((item) => (
                                    <ListItem key={item.service} py={3.5} px={4} borderRadius="lg" boxShadow="lg">
                                        <HStack justifyContent="space-between" alignItems="flex-start" pt={1}>
                                            <Text fontWeight="medium" fontSize={17}>
                                                Dịch vụ: {item.service}
                                            </Text>
                                            <Text fontWeight="medium" fontSize={17}>
                                                {formatMonney(item.price)} đ
                                            </Text>
                                        </HStack>
                                        <Text>
                                            Số lượng: {' '}
                                            <Badge
                                                borderRadius={6}
                                                py={0.5}
                                                px={1.5}
                                                fontWeight="medium"
                                                fontSize={14}>
                                                {item.amount}
                                            </Badge>
                                        </Text>
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

export default OrderDrawerCmp;
