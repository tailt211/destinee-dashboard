import {
    Avatar,
    Badge,
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack,
    Icon,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { AiOutlineColumnHeight } from 'react-icons/ai';
import { CgGenderMale, CgTimer } from 'react-icons/cg';
import { FaPhoneSlash } from 'react-icons/fa';
import { IoMdBookmarks } from 'react-icons/io';
import {
    MdCall,
    MdDateRange,
    MdFavorite,
    MdFileUpload,
    MdLanguage,
    MdLocationOn,
    MdPeople,
    MdPerson,
    MdPowerSettingsNew,
    MdStar,
    MdWork,
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { reviewDisplayer } from '../../../model/call-history/review-displayer';
import { mbtiCategoryDisplayer } from '../../../model/mbti-test/mbti-category-displayer';
import { mbtiTypeDisplayer } from '../../../model/mbti-test/mbti-type-displayer';
import { genderDisplayer } from '../../../model/profile/gender-displayer';
import { jobDisplayer } from '../../../model/profile/job-displayer';
import { regionDisplayer } from '../../../model/profile/region-displayer';
import { sexDisplayer } from '../../../model/profile/sex-displayer';
import { AppDispatch, RootState } from '../../../store';
import { resetProfileDrawer } from '../../../store/profile/profile.slice';
import { fetchProfileThunk } from '../../../store/profile/profile.thunk';
import { convertSecondToHHMMSS, convertToDateTime } from '../../../utils/time.helper';

export interface ProfileDrawerContent {
    id: string;
}

const ProfileDrawerCmp: React.FC<{ isOpen: boolean; onClose: () => void; content?: ProfileDrawerContent }> = ({
    isOpen,
    onClose,
    content,
}) => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { profile, drawerLoading } = useSelector((state: RootState) => state.profile);
    /* Handler */
    const closeDrawerHandler = () => {
        dispatch(resetProfileDrawer());
        onClose();
    };
    /* Effect */
    useEffect(() => {
        if (isOpen && content?.id) dispatch(fetchProfileThunk(content.id));
    }, [dispatch, content?.id, isOpen]);

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={closeDrawerHandler} size="full">
            <DrawerOverlay />
            <DrawerContent w="70%!important" bgColor="grey.100">
                <DrawerCloseButton />
                <DrawerHeader>Thông tin hồ sơ cá nhân</DrawerHeader>
                <DrawerBody>
                    {drawerLoading && (
                        <Spinner
                            mx="auto"
                            display="block"
                            position="absolute"
                            left="50%"
                            top="50%"
                            translateX="-50%"
                            translateY="-50%"
                            size="lg"
                        />
                    )}
                    {!drawerLoading && profile && (
                        <HStack spacing={3} alignItems="flex-start" justifyContent="space-between">
                            <List minW="380px" w="full" py={3} px={4} borderRadius="lg" boxShadow="2xl" spacing={3}>
                                <ListItem>
                                    <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                                        <Avatar name={profile.name} src={profile.avatar} w="50px" borderRadius="12px" me="18px" />
                                        <Flex direction="column" gap="5px">
                                            <Text fontSize="md" fontWeight="bold" minWidth="100%">
                                                {profile.name}
                                            </Text>
                                            <Text fontSize="sm" color="gray.400" fontWeight="normal">
                                                {profile.username}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdPerson} color="teal" />
                                    Nickname: <b>{profile.nickname}</b>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CgGenderMale} color="teal" />
                                    Giới tính:{' '}
                                    <HStack
                                        w="fit-content"
                                        display="inline-flex"
                                        bg={genderDisplayer[profile.gender]?.color}
                                        color="white"
                                        borderRadius={6}
                                        py={0.5}
                                        px={1.5}
                                        spacing={0.5}
                                        fontWeight="medium"
                                        fontSize={13}>
                                        <Text>{genderDisplayer[profile.gender]?.displayer}</Text>
                                        <Icon as={genderDisplayer[profile.gender]?.icon} w={4} h={4} color="white" />
                                    </HStack>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdDateRange} color="teal" />
                                    Ngày sinh:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                        {convertToDateTime(profile.birthdate, 'date')}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={CgGenderMale} color="teal" />
                                    Xu hướng tính dục:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        {sexDisplayer[profile.sex]?.displayer}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={AiOutlineColumnHeight} color="teal" />
                                    Chiều cao:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        {profile.height ? `${profile.height} cm` : 'trống'}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdLocationOn} color="teal" />
                                    Quê quán:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        {profile.origin ? regionDisplayer[profile.origin]?.displayer : 'trống'}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdWork} color="teal" />
                                    Công việc:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        {profile.job
                                            ? `${jobDisplayer[profile.job]?.displayer} tại ${profile.workAt || 'trống'}`
                                            : 'trống'}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdWork} color="teal" />
                                    Chuyên ngành:{' '}
                                    <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                        {profile.major || 'trống'}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdLanguage} color="teal" />
                                    Ngôn ngữ:{' '}
                                    {profile.languages.length === 0 && (
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            trống
                                        </Badge>
                                    )}
                                    {profile.languages.length !== 0 &&
                                        profile.languages.map((lang) => (
                                            <Badge key={lang} borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                                {lang}
                                            </Badge>
                                        ))}
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdFavorite} color="teal" />
                                    Sở thích:{' '}
                                    {profile.hobbies.length === 0 && (
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            trống
                                        </Badge>
                                    )}
                                    {profile.hobbies.length !== 0 &&
                                        profile.hobbies.map((hobby) => (
                                            <Badge key={hobby} borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                                {hobby}
                                            </Badge>
                                        ))}
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdPerson} color="teal" />
                                    Kiểu tính cách:{' '}
                                    {profile.mbtiResult?.type ? (
                                        <Badge
                                            bg={
                                                mbtiCategoryDisplayer[mbtiTypeDisplayer[profile.mbtiResult.type]?.category]?.bgColor
                                            }
                                            color="white"
                                            p="3px 10px"
                                            fontWeight="medium"
                                            borderRadius="8px">
                                            {profile.mbtiResult.type} - {mbtiTypeDisplayer[profile.mbtiResult.type]?.displayer}
                                        </Badge>
                                    ) : (
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={13}>
                                            trống
                                        </Badge>
                                    )}
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdPowerSettingsNew} color="teal" />
                                    Trạng thái:{' '}
                                    <Badge
                                        colorScheme={statusDisplayer(profile.disabled)?.color}
                                        p="3px 10px"
                                        fontWeight="medium"
                                        variant="solid"
                                        borderRadius="6">
                                        {statusDisplayer(profile.disabled)?.displayer}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={IoMdBookmarks} color="teal" />
                                    Số bài kiểm tra tính cách đã thực hiện:{' '}
                                    <Badge p="3px 10px" fontWeight="medium" variant="solid" borderRadius="6">
                                        {profile.mbtiTestCount}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdPeople} color="teal" />
                                    Số bạn bè:{' '}
                                    <Badge p="3px 10px" fontWeight="medium" variant="solid" borderRadius="6">
                                        {profile.friendCount}
                                    </Badge>
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={MdFileUpload} color="teal" />
                                    Số bài đăng:{' '}
                                    <Badge p="3px 10px" fontWeight="medium" variant="solid" borderRadius="6">
                                        {profile.postCount}
                                    </Badge>
                                </ListItem>
                            </List>
                            {profile.statistics && (
                                <List minW="380px" w="full" py={3} px={4} borderRadius="lg" boxShadow="2xl" spacing={3}>
                                    <Text fontSize="lg" fontWeight="semibold" color="teal.600">
                                        Dữ liệu thống kê
                                    </Text>
                                    <ListItem>
                                        <ListIcon as={MdCall} color="teal" />
                                        Số cuộc gọi:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {profile.statistics.callCount}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FaPhoneSlash} color="teal" />
                                        Số lần huỷ hàng chờ:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {profile.statistics.droppedQueueCount}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={FaPhoneSlash} color="teal" />
                                        Tỉ lệ bỏ hàng chờ:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {Number(profile.statistics.droppedQueueRatio * 100).toFixed(2)}%
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CgTimer} color="teal" />
                                        Tổng thời lượng gọi:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertSecondToHHMMSS(profile.statistics.callDuration)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CgTimer} color="teal" />
                                        Thời lượng trung bình 1 cuộc gọi:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertSecondToHHMMSS(profile.statistics.meanCallDuration)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CgTimer} color="teal" />
                                        Thời lượng trung bình 1 hàng chờ:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertSecondToHHMMSS(profile.statistics.meanQueueDuration)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CgTimer} color="teal" />
                                        Thời lượng trung bình 1 hàng chờ (Thành công):{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertSecondToHHMMSS(profile.statistics.meanSucceededQueueDuration)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={CgTimer} color="teal" />
                                        Thời lượng trung bình 1 hàng chờ (Thất bại):{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {convertSecondToHHMMSS(profile.statistics.meanDroppedQueueDuration)}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdStar} color="teal" />
                                        Được đánh giá:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {`${Number(profile.statistics.ratedRatio).toFixed(2)} / 5 ★`}
                                        </Badge>
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={MdStar} color="teal" />
                                        Đánh giá:{' '}
                                        <Badge borderRadius={6} py={0.5} px={1.5} fontWeight="medium" fontSize={14}>
                                            {`${Number(profile.statistics.ratingRatio).toFixed(2)} / 5 ★`}
                                        </Badge>
                                    </ListItem>
                                </List>
                            )}
                            {profile.statistics?.keywordsReviewed && (
                                <Box minW="380px" w="full" py={3} px={4} borderRadius="lg" boxShadow="2xl">
                                    <Text fontSize="lg" fontWeight="semibold" color="teal.600">
                                        Các từ khoá thường dùng
                                    </Text>
                                    <Table variant="striped" mt={2}>
                                        <Thead>
                                            <Tr>
                                                {['Từ khoá', 'Lượt đánh giá'].map((v) => (
                                                    <Th key={v}>{v}</Th>
                                                ))}
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {profile.statistics.keywordsReviewed
                                                .slice() // array is frozen in strict mode => need slice
                                                .sort((a, b) => b.count - a.count)
                                                .map((v) => (
                                                    <Tr key={v.keyword}>
                                                        <Td>
                                                            <Badge
                                                                variant="subtle"
                                                                color="white"
                                                                bgColor={reviewDisplayer[v.keyword]?.baseColor}
                                                                p="3px 10px"
                                                                fontWeight="medium"
                                                                borderRadius="6">
                                                                {reviewDisplayer[v.keyword]?.displayer}
                                                            </Badge>
                                                        </Td>
                                                        <Td fontWeight="bold">{v.count}</Td>
                                                    </Tr>
                                                ))}
                                        </Tbody>
                                    </Table>
                                </Box>
                            )}
                        </HStack>
                    )}
                </DrawerBody>

                <DrawerFooter>
                    <Button ml={3} onClick={closeDrawerHandler}>
                        Đóng
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ProfileDrawerCmp;
