import {
    Button,
    CreateToastFnReturn,
    Divider,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { AppDispatch, RootState } from '../../../store';
import { AccountState } from '../../../store/account/account.slice';
import { changeAccountPasswordThunk } from '../../../store/account/account.thunk';

const schema = yup
    .object({
        password: yup
            .string()
            .trim()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/i, 'Password phải bao gồm chữ và số'),
        confirmPassword: yup
            .string()
            .trim()
            .required('Mật khẩu xác nhận không được trống')
            .oneOf([yup.ref('password'), null], 'Mật khẩu và mật khẩu xác nhận không trùng khớp'),
    })
    .required();

interface IFormInput {
    password: string;
    confirmPassword: string;
}

export interface AccountPasswordChangeModalContent {
    id: string;
    email: string;
}

const AccountPasswordChangeModalCmp: React.FC<{
    content?: AccountPasswordChangeModalContent;
    isOpen: boolean;
    onClose: () => void;
    toast: CreateToastFnReturn;
    isChangeFromProfile?: boolean;
}> = ({ content, isOpen, onClose, toast, isChangeFromProfile }) => {
    const dispatch: AppDispatch = useDispatch();
    const passwordRef = useRef<HTMLInputElement>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<IFormInput>({ mode: 'onBlur', resolver: yupResolver(schema) });

    /* State */
    const { isSubmitting } = useSelector((state: RootState) => state.account) as AccountState;

    /* Handler */
    const onSaveHandler = async () => {
        if (errors.password || errors.confirmPassword || !content) return;
        const result = await dispatch(
            changeAccountPasswordThunk({ id: content?.id, body: { password: watch('password').trim() } }),
        );
        if (result.meta.requestStatus === 'fulfilled') {
            toast({
                description: 'Cập nhật thành công',
                status: 'success',
            });
            closeModalHandler();
        }
    };

    const closeModalHandler = () => {
        onClose();
        reset();
    };

    return (
        <Modal closeOnOverlayClick={false} initialFocusRef={passwordRef} isOpen={isOpen} onClose={closeModalHandler}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color='teal.600'>Thay đổi mật khẩu</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(onSaveHandler)}>
                    <ModalBody>
                        <VStack spacing={3}>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input type="text" disabled value={content?.email} />
                            </FormControl>
                            <Divider />
                            <FormControl isInvalid={!!errors.password}>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <Input
                                    type="password"
                                    style={{ border: errors.password ? '1px solid red' : undefined }}
                                    {...register('password')}
                                />
                                {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                                <FormHelperText>*Mật khẩu phải có ít nhất 8 ký tự gồm chữ và số</FormHelperText>
                            </FormControl>
                            <FormControl isInvalid={!!errors.confirmPassword}>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <Input
                                    type="password"
                                    style={{ border: errors.confirmPassword ? '1px solid red' : undefined }}
                                    {...register('confirmPassword')}
                                />
                                {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
                            </FormControl>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button type="submit" colorScheme="teal" mr={3} isLoading={isSubmitting} loadingText="Đang cập nhật">
                            Lưu
                        </Button>
                        <Button onClick={closeModalHandler} isLoading={isSubmitting}>
                            Hủy
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AccountPasswordChangeModalCmp;
