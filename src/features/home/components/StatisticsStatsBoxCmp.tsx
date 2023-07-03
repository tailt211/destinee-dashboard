import { Center, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { IconType } from 'react-icons/lib';

const StatisticsStatsBoxCmp: React.FC<{
    icon: IconType;
    title: string;
    content?: string;
}> = ({ icon, title, content }) => {
    return (
        <HStack
            bg="whiteAlpha.500"
            borderRadius="lg"
            px={5}
            boxShadow="xl"
            justifyContent="space-between"
            spacing={5}
            w='full'
            h="100px">
            <VStack alignItems="flex-start">
                <Text fontSize="15px" color="blackAlpha.700" fontWeight="normal">
                    {title}
                </Text>
                <Text fontSize="17px" color="black" fontWeight="semibold" mb="6px" my="6px">
                    {content}
                </Text>
            </VStack>
            <Center bg="teal.400" borderRadius="lg" minW="50px" w="50px" h="50px">
                {content && <Icon as={icon} color="white" />}
                {!content && <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.400" size="sm" />}
            </Center>
        </HStack>
    );
};

export default StatisticsStatsBoxCmp;
