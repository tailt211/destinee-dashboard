import {
    Badge,
    Box,
    Button,
    CreateToastFnReturn,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    IconButton,
    Input,
    List,
    ListIcon,
    ListItem,
    Spinner,
    Text,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { AiOutlineNumber, AiOutlineReload } from 'react-icons/ai';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import { MdDateRange, MdPowerSettingsNew } from 'react-icons/md';
import { TiPlus } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { statusDisplayer } from '../../../model/account/status-displayer';
import { AppDispatch, RootState } from '../../../store';
import { resetDrawer } from '../../../store/call-question/call-question.slice';
import {
    createCallQuestionAnswerThunk,
    createCallQuestionThunk,
    deleteCallQuestionAnswerThunk,
    fetchCallQuestionThunk,
    updateCallQuestionAnswerThunk,
    updateCallQuestionThunk
} from '../../../store/call-question/call-question.thunk';
import { convertToDateTime } from '../../../utils/time.helper';
import CallQuestionStatusChangeModalCmp from './CallQuestionStatusChangeModalCmp';

interface IFormInput {
    title: string;
    answers: { title: string }[];
}

export interface CallQuestionDrawerContent {
    id?: string;
    isEditing: boolean;
}

const CallQuestionDrawerCmp: React.FC<{
    content: CallQuestionDrawerContent;
    isOpen: boolean;
    onClose: () => void;
    answerToast: CreateToastFnReturn;
    questionToast: CreateToastFnReturn;
}> = ({ content, isOpen, onClose, answerToast, questionToast }) => {
    const initialRef = React.useRef(null);
    const dispatch: AppDispatch = useDispatch();
    const { isOpen: isOpenDisabledModal, onOpen: openDisabledModal, onClose: closeDisabledModal } = useDisclosure();
    const MIN_NO_OF_ANSWER = process.env.REACT_APP_CALL_QUESTION_ANSWER_MIN
        ? parseInt(process.env.REACT_APP_CALL_QUESTION_ANSWER_MIN)
        : 2;
    const MAX_NO_OF_ANSWER = process.env.REACT_APP_CALL_QUESTION_ANSWER_MAX
        ? parseInt(process.env.REACT_APP_CALL_QUESTION_ANSWER_MAX)
        : 5;

    /* State */
    const {
        question,
        drawerLoading,
        error: callQuestionError,
        answerSubmitting,
        isSubmitting,
    } = useSelector((state: RootState) => state.callQuestion);
    const [isCreating, setIsCreating] = useState(false);

    /* Validation */
    const schema = useMemo(
        () =>
            yup
                .object({
                    title: yup.string().trim().required('Tiêu đề không được bỏ trống'),
                    answers: yup
                        .array()
                        .of(
                            yup.object().shape({
                                title: yup
                                    .string()
                                    .required('Không được bỏ trống')
                                    .max(500, 'Tối đa 500 ký tự')
                                    .test('check-duplicate-answer', 'Câu trả lời đã tồn tại', (value, options) => {
                                        if (!question) return true;
                                        const regex = /\[(\d)\]/;
                                        const group = regex.exec(options.path);
                                        const index = group ? parseInt(group[1]) : null;
                                        const existedIndex = question?.answers.findIndex((a) => a.title === value) as number;
                                        return existedIndex <= -1 || existedIndex === index;
                                    }),
                            }),
                        )
                        .min(2, 'Ít nhất 2 câu trả lời')
                        .max(5, 'Nhiều nhất 5 câu trả lời'),
                })
                .required(),
        [question],
    );

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        reset,
        setValue,
        trigger,
    } = useForm<IFormInput>({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            answers: [{ title: '' }, { title: '' }],
        },
    });

    const { fields, append } = useFieldArray({
        name: 'answers',
        control,
        rules: { minLength: MIN_NO_OF_ANSWER, maxLength: MAX_NO_OF_ANSWER, required: true },
    });

    /* Handler */
    const addAnswerHandler = () => {
        append({ title: '' });
    };

    const removeAnswerHandler = async (index: number) => {
        if (!question) return;
        const result = await dispatch(
            deleteCallQuestionAnswerThunk({ id: question?.id, answerId: question.answers[index].id, index }),
        );
        if (result.meta.requestStatus === 'fulfilled')
            answerToast({
                description: 'Xoá thành công',
                status: 'success',
            });
    };

    const saveAnswerHandler = async (index: number) => {
        if (!question) return;
        if (index >= question.answers.length) {
            const result = await dispatch(
                createCallQuestionAnswerThunk({
                    id: question?.id,
                    body: {
                        title: watch('answers')[index].title.trim(),
                    },
                    index,
                }),
            );
            if (result.meta.requestStatus === 'fulfilled') {
                answerToast({
                    description: 'Cập nhật thành công',
                    status: 'success',
                });
            }
        } else {
            const result = await dispatch(
                updateCallQuestionAnswerThunk({
                    id: question?.id,
                    answerId: question.answers[index].id,
                    body: {
                        title: watch('answers')[index].title.trim(),
                    },
                    index,
                }),
            );
            if (result.meta.requestStatus === 'fulfilled') {
                answerToast({
                    description: 'Cập nhật thành công',
                    status: 'success',
                });
            }
        }
    };

    const saveQuestionHandler = async () => {
        if (!question) return;
        const result = await dispatch(updateCallQuestionThunk({ id: question?.id, body: { title: watch('title').trim() } }));
        if (result.meta.requestStatus === 'fulfilled') {
            answerToast({
                description: 'Cập nhật thành công',
                status: 'success',
            });
        }
    };

    const onSaveHandler = async () => {
        await trigger();
        setIsCreating(true);
    };

    const onCloseDrawerHandler = useCallback(() => {
        dispatch(resetDrawer());
        reset();
        onClose();
    }, [dispatch, reset, onClose]);

    /* Effect */
    useEffect(() => {
        // only fetch when drawer opened & prevent id from cached -> not re-render
        if (isOpen && content?.id) dispatch(fetchCallQuestionThunk(content.id));
    }, [dispatch, content?.id, isOpen]);

    useEffect(() => {
        if (question?.title) setValue('title', question.title);
        if (question?.answers)
            setValue(
                'answers',
                question.answers.map((a) => ({ title: a.title })),
            );
    }, [setValue, question?.title, question?.answers, isOpen]);

    useEffect(() => {
        if (!isCreating || !isEmpty(errors)) {
            setIsCreating(false);
            return;
        }
        dispatch(
            createCallQuestionThunk({
                body: { title: watch('title').trim(), answers: watch('answers').map((a) => ({ title: a.title.trim() })) },
            }),
        ).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                setIsCreating(false);
                answerToast({
                    description: 'Tạo thành công',
                    status: 'success',
                });
                onCloseDrawerHandler();
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCreating]);

    return (
        <Drawer
            initialFocusRef={initialRef}
            isOpen={isOpen}
            onClose={onCloseDrawerHandler}
            closeOnOverlayClick={false}
            placement="right"
            size="md">
            <DrawerOverlay />
            <DrawerContent overflow="scroll">
                <DrawerHeader>{content?.isEditing ? 'Cập nhật thông tin' : 'Tạo mới câu hỏi'}</DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody pb={6} h="full" w="full">
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
                    {!drawerLoading && (
                        <>
                            <form onSubmit={handleSubmit(onSaveHandler)}>
                                {question && (
                                    <Box bgColor="blackAlpha.200" py={3} pl={3} alignItems="start" borderRadius="lg">
                                        <List spacing={3}>
                                            <ListItem>
                                                <ListIcon as={AiOutlineNumber} color="teal" />
                                                ID: <b>{question?.id}</b>
                                            </ListItem>
                                            <ListItem>
                                                <ListIcon as={MdDateRange} color="teal" />
                                                Ngày tạo: <b>{convertToDateTime(question?.createdAt, 'date')}</b>
                                            </ListItem>
                                            <ListItem>
                                                <ListIcon as={MdPowerSettingsNew} color="teal" />
                                                Trạng thái:{'  '}
                                                <Badge
                                                    colorScheme={statusDisplayer(question.disabled)?.color}
                                                    p="3px 10px"
                                                    fontWeight="medium"
                                                    variant="solid"
                                                    borderRadius="6">
                                                    {statusDisplayer(question.disabled)?.displayer}
                                                </Badge>
                                            </ListItem>
                                        </List>
                                    </Box>
                                )}
                                <FormControl isInvalid={!!errors.title} mt={3}>
                                    <FormLabel>Tiêu đề</FormLabel>
                                    <HStack spacing={3}>
                                        <Input
                                            placeholder="Tiêu đề"
                                            style={{ border: errors.title ? '1px solid red' : undefined }}
                                            onKeyDown={(event) => {
                                                if (event.key !== 'Enter') return;
                                                saveQuestionHandler();
                                            }}
                                            {...register(`title`)}
                                        />
                                        {content?.isEditing && (
                                            <IconButton
                                                aria-label="save title"
                                                size="md"
                                                icon={<HiCheck />}
                                                disabled={watch('title')?.trim() === question?.title}
                                                colorScheme="dTeal"
                                                isLoading={isSubmitting}
                                                onClick={saveQuestionHandler}
                                            />
                                        )}
                                    </HStack>
                                    {errors.title && <FormErrorMessage>{errors.title.message}</FormErrorMessage>}
                                    <FormHelperText>*Tiêu đề không được vượt quá 500 ký tự</FormHelperText>
                                </FormControl>
                                <Divider mt="5" mb="3" />
                                <VStack spacing={3}>
                                    {fields.map((field, index) => {
                                        return (
                                            <FormControl key={field.id} isInvalid={errors.answers && !!errors.answers[index]}>
                                                <FormLabel>Câu trả lời #{index + 1} </FormLabel>
                                                <HStack spacing={3}>
                                                    <Input
                                                        placeholder="Câu trả lời"
                                                        style={{
                                                            border: errors.answers
                                                                ? errors.answers[index]?.title
                                                                    ? '1px solid red'
                                                                    : undefined
                                                                : undefined,
                                                        }}
                                                        onKeyDown={(event) => {
                                                            if (event.key !== 'Enter') return;
                                                            saveAnswerHandler(index);
                                                        }}
                                                        type="text"
                                                        {...register(`answers.${index}.title` as const)}
                                                    />
                                                    {content?.isEditing && (
                                                        <IconButton
                                                            aria-label="save answer"
                                                            size="md"
                                                            icon={<HiCheck />}
                                                            disabled={
                                                                (errors.answers && !!errors.answers[index]) || // have errors
                                                                watch('answers')[index]?.title?.trim() ===
                                                                    question?.answers[index]?.title //no changes
                                                            }
                                                            colorScheme="dTeal"
                                                            isLoading={answerSubmitting[index]}
                                                            onClick={saveAnswerHandler.bind(null, index)}
                                                        />
                                                    )}
                                                    {index < (question?.answers ? question.answers.length : 0) && (
                                                        <IconButton
                                                            aria-label="delete answer"
                                                            size="md"
                                                            variant="outline"
                                                            icon={<FaRegTrashAlt />}
                                                            colorScheme="red"
                                                            isLoading={answerSubmitting[index]}
                                                            onClick={removeAnswerHandler.bind(null, index)}
                                                        />
                                                    )}
                                                </HStack>
                                                {errors.answers && errors.answers[index]?.title && (
                                                    <FormErrorMessage>{errors.answers[index]?.title?.message}</FormErrorMessage>
                                                )}
                                            </FormControl>
                                        );
                                    })}
                                </VStack>
                                {fields.length < MAX_NO_OF_ANSWER && (
                                    <Button
                                        mt="3"
                                        leftIcon={<TiPlus />}
                                        size="md"
                                        fontWeight="bold"
                                        colorScheme="teal"
                                        variant="outline"
                                        disabled={
                                            (question
                                                ? fields.length > question?.answers.length
                                                : fields.length > MAX_NO_OF_ANSWER) ||
                                            watch('answers')[watch('answers').length - 1].title?.trim() === ''
                                        }
                                        onClick={addAnswerHandler}>
                                        Câu trả lời
                                    </Button>
                                )}
                            </form>
                            {callQuestionError && (
                                <>
                                    <Divider my={3} />
                                    <HStack spacing={2}>
                                        <Text fontSize="md" fontWeight="medium" color="tomato">
                                            *{callQuestionError}
                                        </Text>
                                        <Button
                                            colorScheme="yellow"
                                            mr={3}
                                            type="button"
                                            leftIcon={<AiOutlineReload />}
                                            isLoading={drawerLoading}
                                            onClick={() => {
                                                dispatch(fetchCallQuestionThunk(content.id!));
                                            }}>
                                            Tải lại
                                        </Button>
                                    </HStack>
                                </>
                            )}
                        </>
                    )}
                </DrawerBody>
                <DrawerFooter>
                    {question && (
                        <Button colorScheme={statusDisplayer(!question.disabled)?.colorScheme} onClick={openDisabledModal}>
                            {statusDisplayer(!question.disabled)?.displayer}
                        </Button>
                    )}
                    {!question && (
                        <Button
                            colorScheme="teal"
                            onClick={onSaveHandler}
                            isLoading={isSubmitting}
                            loadingText="Đang gửi"
                            disabled={!isEmpty(errors)}>
                            Gửi
                        </Button>
                    )}
                    <Button onClick={onCloseDrawerHandler} isLoading={isSubmitting} ml={3}>
                        Hủy
                    </Button>
                </DrawerFooter>
            </DrawerContent>
            {question && (
                <CallQuestionStatusChangeModalCmp
                    isOpen={isOpenDisabledModal}
                    onClose={closeDisabledModal}
                    content={{
                        id: question?.id,
                        title: question?.title,
                        disabled: question?.disabled,
                    }}
                    toast={questionToast}
                />
            )}
        </Drawer>
    );
};

export default CallQuestionDrawerCmp;
