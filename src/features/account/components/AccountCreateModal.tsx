import {
    Button,
    CreateToastFnReturn,
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
    Select
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { roleDisplayer, ROLE_LABEL } from '../../../model/account/role-displayer';
import { ROLE } from '../../../model/account/roles.enum';
import { AppDispatch, RootState } from '../../../store';
import { AccountState, clearError as clearAccountError } from '../../../store/account/account.slice';
import { createAccountThunk } from '../../../store/account/account.thunk';

const schema = yup
    .object({
        email: yup.string().trim().required('Email không được bỏ trống').email('Email không hợp lệ'),
        password: yup
            .string()
            .trim()
            .required('Mật khẩu không được bỏ trống')
            .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
            .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/i, 'Mật khẩu phải bao gồm chữ và số'),
        confirmPassword: yup
            .string()
            .trim()
            .required('Mật khẩu xác nhận không được trống')
            .oneOf([yup.ref('password'), null], 'Mật khẩu và mật khẩu xác nhận không trùng khớp'),
    })
    .required();

interface IFormInput {
    email: string;
    password: string;
    confirmPassword: string;
}

const AccountCreateModalCmp: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    refresh: () => void;
    toast: CreateToastFnReturn;
}> = ({ isOpen, onClose, refresh, toast }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset: resetForm,
    } = useForm<IFormInput>({ mode: 'onBlur', resolver: yupResolver(schema) });

    const dispatch: AppDispatch = useDispatch();
    const roleRef = useRef<HTMLSelectElement>(null);
    /* State */
    const { firebaseError, isSubmitting } = useSelector((state: RootState) => state.account) as AccountState;
    /* Handler */
    const onSaveHandler = async () => {
        if (!errors.email && !errors.password && !errors.confirmPassword) {
            const result = await dispatch(
                createAccountThunk({
                    email: watch('email').trim()!,
                    password: watch('password').trim()!,
                    role: roleRef.current?.value as ROLE,
                }),
            );
            if (result.meta.requestStatus === 'fulfilled') {
                toast({
                    description: 'Tạo tài khoản mới thành công',
                    status: 'success',
                });
                onCloseModalHandler();
            }
        }
    };

    const onCloseModalHandler = () => {
        resetForm();
        refresh();
        dispatch(clearAccountError());
        onClose();
    };

    return (
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onCloseModalHandler}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader color='teal.600'>Tạo tài khoản</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit(onSaveHandler)}>
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!errors.email || !!firebaseError}>
                            <FormLabel>Email</FormLabel>
                            <Input
                                type="text"
                                style={{ border: errors.email || firebaseError ? '1px solid red' : '' }}
                                {...register('email')}
                            />
                            {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                            {firebaseError && <FormErrorMessage>{firebaseError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.password}>
                            <FormLabel>Nhập mật khẩu</FormLabel>
                            <Input
                                type="password"
                                style={{ border: errors.password ? '1px solid red' : '' }}
                                {...register('password')}
                            />
                            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                            <FormHelperText>*Mật khẩu phải có ít nhất 8 ký tự gồm chữ và số</FormHelperText>
                        </FormControl>

                        <FormControl mt={4} isInvalid={!!errors.confirmPassword}>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <Input
                                type="password"
                                style={{ border: errors.confirmPassword ? '1px solid red' : '' }}
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>{ROLE_LABEL}</FormLabel>
                            <Select defaultValue={ROLE.ADMIN} ref={roleRef} variant="filled" disabled borderColor="gray.400">
                                {Object.entries(roleDisplayer).map(([key, value]) => (
                                    <option key={key} value={key}>
                                        {value.displayer}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="teal" mr={3} type="submit" isLoading={isSubmitting} loadingText='Đang tạo mới'>
                            Lưu
                        </Button>
                        <Button onClick={onCloseModalHandler} isLoading={isSubmitting}>
                            Hủy
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default AccountCreateModalCmp;
