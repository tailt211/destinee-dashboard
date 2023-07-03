import { Avatar, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { IoMdStar } from 'react-icons/io';
import { CallerInfo as CallerInfoOverall } from '../../../model/call-history/dto/call-history-overall.dto';
import { getAvatar } from '../../../model/image/image.helper';
import { TYPE_IMAGE } from '../../../model/image/type-image.enum';
import { genderDisplayer } from '../../../model/profile/gender-displayer';

const CallHistoryCallerCmp: React.FC<{ caller: CallerInfoOverall }> = ({ caller }) => {
    return (
        <HStack spacing={3}>
            <Avatar name="avatar" boxShadow="dark-lg" src={getAvatar(caller.avatar, TYPE_IMAGE.SQUARE, caller.gender)} />
            <VStack spacing={1} alignItems="start">
                <HStack spacing={1}>
                    <Text fontWeight='medium' fontSize='md'>{caller.name}</Text>
                    <Icon as={genderDisplayer[caller.gender]?.icon} w={4} h={4} color={genderDisplayer[caller.gender]?.color} />
                </HStack>
                {caller.rates && (
                    <HStack spacing={0.1}>
                        {Array.from(Array(caller.rates)).map((_, i) => (
                            <Icon key={i} as={IoMdStar} w={4} h={4} color="yellow.400" />
                        ))}
                    </HStack>
                )}
            </VStack>
        </HStack>
    );
};

export default CallHistoryCallerCmp;
