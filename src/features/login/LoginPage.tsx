import {
    Avatar,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    useToast,
} from '@chakra-ui/react';
import { FormEvent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import destineeLogo from '../../assets/destinee-logo.png';
import { AppDispatch, RootState } from '../../store';
import { AuthState, clearError as clearAuthError } from '../../store/auth/auth.slice';
import { loginThunk, logoutThunk } from '../../store/auth/auth.thunk';

const LoginPage: React.FC = (props) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const toast = useToast();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    /* State */
    const { error, loading, token, isAllowed } = useSelector((state: RootState) => state.auth) as AuthState;

    /* Handler */
    const loginHandler = (e: FormEvent) => {
        e.preventDefault();
        dispatch(loginThunk({ email: emailRef.current?.value.trim()!, password: passwordRef.current?.value.trim()! }));
    };
    /* Effect */
    useEffect(() => {
        if (error)
            toast({
                title: 'Đăng nhập',
                description: error,
                status: 'error',
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => {
                    dispatch(clearAuthError());
                },
            });
    }, [error, toast, dispatch]);

    useEffect(() => {
        if (token && !loading && isAllowed) navigate('/', { replace: true });
        if (token && !loading && isAllowed !== undefined && !isAllowed) dispatch(logoutThunk());
    }, [token, loading, navigate, isAllowed, dispatch]);

    return (
        <Flex minH={'100vh'} align={'center'} justify={'center'} bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} w="lg" py={12} px={6}>
                <Box rounded={'lg'} bg={useColorModeValue('white', 'gray.700')} boxShadow={'lg'} p={8}>
                    <Avatar display="block" mx="auto" mt="-16" size="xl" src={destineeLogo} />
                    <form onSubmit={loginHandler}>
                        <Stack spacing={4}>
                            <Heading fontSize={'2xl'} mt="3" textAlign="center">
                                Đăng nhập
                            </Heading>
                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input type="text" ref={emailRef} disabled={loading} />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" ref={passwordRef} disabled={loading} />
                            </FormControl>
                            <Stack spacing={10}>
                                {/* <Stack
                                        direction={{ base: 'column', sm: 'row' }}
                                        align={'start'}
                                        justify={'space-between'}
                                    >
                                        <Checkbox>Remember me</Checkbox>
                                        <Link color={'blue.400'}>Forgot password?</Link>
                                    </Stack> */}
                                <Button
                                    type="submit"
                                    bg={'gray.700'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'gray.600',
                                    }}
                                    isLoading={loading}
                                    loadingText="Đăng đăng nhập">
                                    Đăng nhập
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </Box>
            </Stack>
        </Flex>
    );
};

export default LoginPage;
