import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthState } from '../store/auth/auth.slice';

const useToastGlobal = () => {
    // const dispatch: AppDispatch = useDispatch();
    const toast = useToast();
    /* State */
    const { token, isAllowed } = useSelector((state: RootState) => state.auth) as AuthState;
    /* Effect */
    useEffect(() => {
        if (token && isAllowed)
            toast({
                title: 'Đăng nhập',
                description: 'Vừa đăng nhập thành công',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        if (token && isAllowed !== undefined && !isAllowed)
            toast({
                title: 'Đăng nhập',
                description: 'Bạn không có quyền truy cập vào trang này',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
    }, [token, toast, isAllowed]);
};

export default useToastGlobal;
