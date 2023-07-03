import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { PATHS } from '../../router/paths';
import { RootState } from '../../store';
import { getLocalStorageToken } from '../../store/auth/auth.service';
import { AuthState } from '../../store/auth/auth.slice';
import MobileNavCmp from './components/MobileNavCmp';
import SidebarContentCmp from './components/SidebarContentCmp';

const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    /* State */
    const { token, loading } = useSelector((state: RootState) => state.auth) as AuthState;
    const localToken = React.useMemo(() => {
        return token || getLocalStorageToken();
    }, [token]);
    /* Effect */
    useEffect(() => {
        if (!localToken && !loading && !token)
            navigate(`/${PATHS.LOGIN}`, { replace: true });
    }, [token, loading, navigate, localToken]);

    return (
        <Box minH="100vh" bg="gray.100">
            <SidebarContentCmp display={{ base: 'none', md: 'block' }} />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContentCmp onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNavCmp onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p="4">
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
