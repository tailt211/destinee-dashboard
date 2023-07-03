import { Flex, FlexProps, Icon } from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons/lib';
import { NavLink } from 'react-router-dom';
import styles from './NavItemCmp.module.scss';
interface NavItemProps extends FlexProps {
	icon: IconType;
	to: string;
	children: ReactText;
}

const NavItemCmp = ({ icon, to, children, ...rest }: NavItemProps) => {
	return (
		<NavLink
			to={to}
			style={{ textDecoration: 'none' }}
			className={(navData) => (navData.isActive ? styles.active : undefined)}
		>
			<Flex
				align="center"
				p="4"
				mx="4"
				mt='1'
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: 'teal.400',
					color: 'white',
				}}
				{...rest}
			>
				{icon && <Icon mr="4" fontSize="16" as={icon} />}
				{children}
			</Flex>
		</NavLink>
	);
};

export default NavItemCmp;
