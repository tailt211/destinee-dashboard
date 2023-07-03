import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaStar } from 'react-icons/fa';

const ProfileInfoLineCmp: React.FC<{ title: string; content?: string | number; starUnit?: boolean }> = ({ title, content, starUnit }) => {
    return (
        <Flex align="center" mb="18px">
            <Text fontSize="md" color="black" fontWeight="bold" me="10px">
                {title}
            </Text>
            <Text fontSize="md" color="gray.700" fontWeight="400">
                {`${content} `}
                {starUnit && <Icon as={FaStar} color="yellow.300" />}
            </Text>
        </Flex>
    );
};

export default ProfileInfoLineCmp;
