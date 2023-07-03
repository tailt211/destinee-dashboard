import {
    Button,
    CreateToastFnReturn,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { AccountState } from '../../../store/account/account.slice';
import { updateAccountDisabledThunk } from '../../../store/account/account.thunk';

export interface AccountStatusChangeModalContent {
    id: string;
    email: string;
    disabled: boolean;
}

const AccountStatusChangeModalCmp: React.FC<{
    content?: AccountStatusChangeModalContent;
    isOpen: boolean;
    toast: CreateToastFnReturn;
    onClose: () => void;
    onSucceed?: () => void;
}> = ({ content, isOpen, onClose, toast, onSucceed }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { isSubmitting } = useSelector((state: RootState) => state.account) as AccountState;
    /* Handler */
    const onSaveHandler = async () => {
        if (!content) return;
        const result = await dispatch(updateAccountDisabledThunk({ id: content.id, body: { disabled: !content.disabled } }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast({
                description: 'Cập nhật trạng thái thành công',
                status: 'success',
            });
            if(onSucceed) onSucceed();
            onClose();
        }
    };

    return (
        <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color="teal.600">Cập nhật trạng thái</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6} fontSize="16px">
                    <Stack spacing={2}>
                        <Text>
                            ID: <b>{content?.id}</b>
                        </Text>
                        <Text>
                            Email: <b>{content?.email}</b>
                        </Text>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme={statusDisplayer(!content?.disabled!)?.colorScheme}
                        mr={3}
                        onClick={onSaveHandler}
                        isLoading={isSubmitting}
                        loadingText="Đang cập nhật">
                        {statusDisplayer(!content?.disabled!)?.displayer}
                    </Button>
                    <Button onClick={onClose} isLoading={isSubmitting}>
                        Hủy
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AccountStatusChangeModalCmp;
