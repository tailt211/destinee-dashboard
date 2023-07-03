import {
    Badge,
    Box,
    Button,
    CreateToastFnReturn,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    List,
    ListIcon,
    ListItem,
    Spinner,
    useDisclosure,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { MdDateRange, MdEmail, MdPerson, MdPowerSettingsNew, MdVerifiedUser } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { roleDisplayer, ROLE_LABEL } from '../../../model/account/role-displayer';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { AuthState } from '../../../store/auth/auth.slice';
import {
    ProfileState,
    resetAccountDrawer as resetProfileDrawer,
    updateStatus as updateProfileStatus,
} from '../../../store/profile/profile.slice';
import { fetchAccountThunk } from '../../../store/profile/profile.thunk';
import { convertToDateTime } from '../../../utils/time.helper';
import AccountStatusChangeModalCmp, {
    AccountStatusChangeModalContent,
} from '../../account/components/AccountStatusChangeModalCmp';

export interface ProfileViewAccountDrawerContent {
    accountId: string;
    disabled: boolean;
}

const ProfileViewAccountDrawerCmp: React.FC<{
    content?: ProfileViewAccountDrawerContent;
    isOpen: boolean;
    onClose: () => void;
    toast: CreateToastFnReturn;
}> = ({ isOpen, onClose, content, toast }) => {
    const dispatch: AppDispatch = useDispatch();
    /* Modal */
    const { isOpen: isOpenStatusModal, onOpen: openStatusModal, onClose: closeStatusModal } = useDisclosure();
    /* State */
    const { myAccount } = useSelector((state: RootState) => state.auth) as AuthState;
    const { account, drawerLoading } = useSelector((state: RootState) => state.profile) as ProfileState;
    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetProfileDrawer());
        onClose();
    };
    /* Effect */
    useEffect(() => {
        if (isOpen && content?.accountId) dispatch(fetchAccountThunk(content.accountId));
    }, [dispatch, content?.accountId, isOpen]);

    return (
        <>
            {account && (
                <AccountStatusChangeModalCmp
                    isOpen={isOpenStatusModal}
                    onClose={closeStatusModal}
                    content={
                        { id: account.id, email: account.email, disabled: account.disabled } as AccountStatusChangeModalContent
                    }
                    toast={toast}
                    onSucceed={() => {
                        dispatch(updateProfileStatus({ accountId: account.id, disabled: !account.disabled }));
                    }}
                />
            )}
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md" closeOnOverlayClick={true}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Thông tin tài khoản</DrawerHeader>
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
                        {!drawerLoading && account && (
                            <Box bgColor="blackAlpha.200" py={3} pl={3} alignItems="start" borderRadius="lg">
                                <List spacing={3}>
                                    <ListItem>
                                        <ListIcon as={MdPerson} color="teal" />
                                        ID: {account.id}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPerson} color="teal" />
                                        UID: {account.uid}
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdEmail} color="teal" />
                                        Email: <b>{account.email}</b>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdVerifiedUser} color="teal" />
                                        {ROLE_LABEL}:{' '}
                                        <Badge
                                            variant="subtle"
                                            colorScheme={roleDisplayer[account.role]?.color}
                                            p="3px 10px"
                                            fontWeight="medium"
                                            borderRadius="6">
                                            {roleDisplayer[account.role]?.displayer}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdPowerSettingsNew} color="teal" />
                                        Trạng thái:{' '}
                                        <Badge
                                            colorScheme={statusDisplayer(account.disabled)?.color}
                                            p="3px 10px"
                                            fontWeight="medium"
                                            variant="solid"
                                            borderRadius="6">
                                            {statusDisplayer(account.disabled)?.displayer}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdDateRange} color="teal" />
                                        Ngày tạo:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertToDateTime(account.createdAt)}
                                        </Badge>
                                    </ListItem>
                                </List>
                            </Box>
                        )}
                    </DrawerBody>
                    <DrawerFooter>
                        {account && myAccount?.id !== account.id && (
                            <Button colorScheme={statusDisplayer(!account.disabled)?.colorScheme} onClick={openStatusModal}>
                                {statusDisplayer(!account.disabled)?.displayer}
                            </Button>
                        )}
                        <Button ml={3} onClick={closeDrawerHandler}>
                            Đóng
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ProfileViewAccountDrawerCmp;
