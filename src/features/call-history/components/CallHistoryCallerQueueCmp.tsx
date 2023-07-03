import { Badge, Divider, HStack, Icon, List, ListIcon, ListItem, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { CgGenderMale, CgSearchLoading } from 'react-icons/cg';
import { FaBirthdayCake } from 'react-icons/fa';
import { IoMdTimer } from 'react-icons/io';
import { MdLanguage, MdLocationOn, MdRateReview } from 'react-icons/md';
import { CallerInfo as CallerInfoDetail } from '../../../model/call-history/dto/call-history-detail.dto';
import { reviewDisplayer } from '../../../model/call-history/review-displayer';
import { topicDisplayer } from '../../../model/call-history/topic-displayer';
import { genderDisplayer } from '../../../model/profile/gender-displayer';
import { languageDisplayer } from '../../../model/profile/language-displayer';
import { regionDisplayer } from '../../../model/profile/region-displayer';
import { sexDisplayer } from '../../../model/profile/sex-displayer';
import { convertSecondToHHMMSS } from '../../../utils/time.helper';
import CallHistoryCallerCmp from './CallHistoryCallerCmp';

const CallHistoryCallerQueueCmp: React.FC<{ caller: CallerInfoDetail }> = ({ caller }) => {
    return (
        <VStack alignItems="flex-start" spacing={3}>
            <CallHistoryCallerCmp
                caller={{
                    id: caller.id,
                    name: caller.name,
                    avatar: caller.avatar,
                    gender: caller.gender,
                    rates: caller.rates,
                }}
            />
            <List spacing={3}>
                <ListItem>
                    <ListIcon as={MdRateReview} color="teal" />
                    Đánh giá:{' '}
                    <HStack display="inline" spacing={2}>
                        {caller.reviews?.map((r) => (
                            <Badge key={r} borderRadius={6} py={0.5} px={1.5} colorScheme="facebook" fontWeight="medium" fontSize={13}>
                                {reviewDisplayer[r]?.displayer}
                            </Badge>
                        ))}
                    </HStack>
                </ListItem>
                <ListItem>
                    <ListIcon as={IoMdTimer} color="teal" />
                    Thời lượng hàng chờ:{' '}
                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                        {caller.queueTime ? convertSecondToHHMMSS(caller.queueTime) : 'trống'}
                    </Badge>
                </ListItem>
            </List>
            <Divider w='80%'/>
            <Text fontSize="md" fontWeight="medium" textAlign="center" w="full">
                Tiêu chí tìm kiếm cuộc gọi
            </Text>
            <List spacing={3} w="full">
                <ListItem>
                    <ListIcon as={CgGenderMale} color="teal" />
                    Giới tính:{' '}
                    <HStack
                        w="fit-content"
                        display="inline-flex"
                        bg={genderDisplayer[caller.gender]?.color}
                        color="white"
                        borderRadius={6}
                        py={0.5}
                        px={1.5}
                        spacing={0.5}
                        fontWeight="medium"
                        fontSize={13}>
                        <Text>{genderDisplayer[caller.gender]?.displayer}</Text>
                        <Icon as={genderDisplayer[caller.gender]?.icon} w={4} h={4} color="white" />
                    </HStack>
                </ListItem>
                <ListItem>
                    <ListIcon as={FaBirthdayCake} color="teal" />
                    Độ tuổi:{' '}
                    {caller.filter.ageRange ? (
                        <HStack
                            w="fit-content"
                            display="inline-flex"
                            borderRadius={6}
                            py={0.5}
                            px={1.5}
                            spacing={0.5}
                            fontWeight="medium"
                            fontSize={13}>
                            <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                {caller.filter.ageRange[0]}
                            </Badge>
                            <Text>đến</Text>
                            <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                {caller.filter.ageRange[1]}
                            </Badge>
                        </HStack>
                    ) : (
                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                            tự động
                        </Badge>
                    )}
                </ListItem>
                <ListItem>
                    <ListIcon as={MdLocationOn} color="teal" />
                    Vùng miền:{' '}
                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                        {caller.filter.origin
                            ? regionDisplayer[caller.filter.origin]?.displayer
                            : 'tự động'}
                    </Badge>
                </ListItem>
                <ListItem>
                    <ListIcon as={CgSearchLoading} color="teal" />
                    Chủ đề:{' '}
                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                        {caller.filter.topic
                            ? topicDisplayer[caller.filter.topic]?.displayer
                            : 'tự động'}
                    </Badge>
                </ListItem>
                <ListItem>
                    <ListIcon as={MdLanguage} color="teal" />
                    Ngôn ngữ:{' '}
                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                        {caller.filter.language
                            ? languageDisplayer[caller.filter.language]?.displayer
                            : 'tự động'}
                    </Badge>
                </ListItem>
                <ListItem>
                    <ListIcon as={CgGenderMale} color="teal" />
                    Xu hướng tính dục:{' '}
                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                        {caller.filter.sex ? sexDisplayer[caller.filter.sex]?.displayer : 'tự động'}
                    </Badge>
                </ListItem>
            </List>
        </VStack>
    );
};

export default CallHistoryCallerQueueCmp;
