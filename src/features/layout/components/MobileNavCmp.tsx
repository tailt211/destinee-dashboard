import {
	Avatar,
	Box,
	Flex,
	FlexProps,
	HStack,
	IconButton,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useColorModeValue,
	VStack,
} from '@chakra-ui/react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import destineeBrandLogo from '../../../assets/destinee-brand-black-logo.png';
import destineeLogo from '../../../assets/destinee-logo.png';
import { PATHS } from '../../../router/paths';
import { AppDispatch } from '../../../store';
import { logoutThunk } from '../../../store/auth/auth.thunk';

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNavCmp = ({ onOpen, ...rest }: MobileProps) => {
	const dispatch = useDispatch<AppDispatch>();
	/* Handler */
	const logoutHandler = () => {
		dispatch(logoutThunk());
	}

	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 4 }}
			py={1}
			alignItems="center"
			bg={useColorModeValue('white', 'gray.900')}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
			justifyContent={{ base: 'space-between', md: 'flex-end' }}
			{...rest}
		>
			<IconButton
				display={{ base: 'flex', md: 'none' }}
				onClick={onOpen}
				variant="outline"
				aria-label="open menu"
				icon={<FiMenu />}
			/>
			<Link to={`/${PATHS.HOME}`}>
				<Image
					src={destineeBrandLogo}
					alt="Destinee Logo"
					display={{ base: 'block', md: 'none' }}
				/>
			</Link>
			<HStack spacing={{ base: '0', md: '6' }}>
				{/* <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} /> */}
				<Flex alignItems={'center'}>
					<Menu>
						<MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
							<HStack>
								<Avatar size={'sm'} src={destineeLogo} />
								<VStack
									display={{ base: 'none', md: 'flex' }}
									alignItems="flex-start"
									spacing="1px"
									ml="2"
								>
									<Text fontSize="sm">Jungtin Nguyen</Text>
									<Text fontSize="xs" color="gray.600">
										Admin
									</Text>
								</VStack>
								<Box display={{ base: 'none', md: 'flex' }}>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							bg={useColorModeValue('white', 'gray.900')}
							borderColor={useColorModeValue('gray.200', 'gray.700')}
						>
							{/* <MenuItem>Cài đặt</MenuItem>
							<MenuDivider /> */}
							<MenuItem onClick={logoutHandler}>Đăng xuất</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</HStack>
		</Flex>
	);
};

export default MobileNavCmp;
