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
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { updateCallQuestionDisabledThunk } from '../../../store/call-question/call-question.thunk';

export interface CallQuestionStatusChangeModalContent {
    id: string;
    title: string;
    disabled: boolean;
}

const CallQuestionStatusChangeModalCmp: React.FC<{
    content: CallQuestionStatusChangeModalContent;
    isOpen: boolean;
    onClose: () => void;
    toast: CreateToastFnReturn;
}> = ({ content, isOpen, onClose, toast }) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { isSubmitting } = useSelector((state: RootState) => state.callQuestion);
    /* Handler */
    const saveHandler = async () => {
        const result = await dispatch(updateCallQuestionDisabledThunk({ id: content.id, body: { disabled: !content.disabled } }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast({
                description: 'Cập nhật trạng thái thành công',
                status: 'success',
            });
            onClose();
        }
    };

    return (
        <Modal closeOnOverlayClick={true} isOpen={isOpen} onClose={onClose}>
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
                            Câu hỏi: <b>{content?.title}</b>
                        </Text>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme={statusDisplayer(!content?.disabled!)?.colorScheme}
                        mr={3}
                        onClick={saveHandler}
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

export default CallQuestionStatusChangeModalCmp;
