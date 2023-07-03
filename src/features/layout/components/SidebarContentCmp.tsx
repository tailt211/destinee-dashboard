import { Box, BoxProps, CloseButton, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';
import NavItemCmp from './NavItemCmp';

import { FiAward, FiBookOpen, FiHome, FiLayers, FiPhoneCall, FiShoppingCart, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import destineeLogo from '../../../assets/destinee-brand-black-logo.png';
import { PATHS } from '../../../router/paths';
import { MdAttachMoney } from 'react-icons/md';

interface LinkItemProps {
    name: string;
    to: string;
    icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Trang chủ', to: `/${PATHS.HOME}`, icon: FiHome },
    { name: 'Tài khoản', to: `/${PATHS.ACCOUNT}`, icon: FiUsers },
    { name: 'Hồ sơ tài khoản', to: `/${PATHS.PROFILE}`, icon: FiAward },
    { name: 'Lịch sử cuộc gọi', to: `/${PATHS.CALL_HISTORY}`, icon: FiPhoneCall },
    { name: 'Câu hỏi/trả lời kiến tạo', to: `/${PATHS.CALL_QUESTION}`, icon: FiLayers },
    // { name: 'Báo cáo', to: `/${PATHS.REPORT}`, icon: FiClipboard },
    // { name: 'Tin nhắn hỗ trợ', to: `/${PATHS.SUPPORT}`, icon: FiMessageSquare },
    { name: 'Trắc nghiệm tính cách', to: `/${PATHS.MBTI}`, icon: FiBookOpen },
    { name: 'Đơn hàng', to: `/${PATHS.ORDER}`, icon: FiShoppingCart },
    { name: 'Lịch sử thanh toán', to: `/${PATHS.PAYMENT}`, icon: MdAttachMoney },
];

interface SidebarProps extends BoxProps {
    onClose?: () => void;
}

const SidebarContentCmp = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent={{ base: 'space-between', md: 'center' }}>
                <Link to={`/${PATHS.HOME}`}>
                    <Image src={destineeLogo} alt="Destinee Logo" />
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItemCmp key={link.name} to={link.to} icon={link.icon}>
                    {link.name}
                </NavItemCmp>
            ))}
        </Box>
    );
};

export default SidebarContentCmp;
