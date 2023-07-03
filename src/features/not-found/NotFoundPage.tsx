import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = (props) => {
	return (
		<Box textAlign="center" py={10} px={6}>
			<Heading
				display="inline-block"
				as="h2"
				size="2xl"
				bgGradient="linear(to-r, teal.400, teal.600)"
				backgroundClip="text"
			>
				404
			</Heading>
			<Text fontSize="30" mt={3} mb={2} fontWeight='bold'>
				Không tìm thấy trang
			</Text>
			<Text color={'gray.500'} mb={6}>
				Trang bạn đang tìm dường như không tồn tại
			</Text>
			<Link to="/">
				<Button
					colorScheme="teal"
					bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
					color="white"
					variant="solid"
				>
					Về trang chủ
				</Button>
			</Link>
		</Box>
	);
};

export default NotFoundPage;
