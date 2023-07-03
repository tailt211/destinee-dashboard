import { ConflictException, DuplicateKeyException, EXCEPTION, NotAcceptableException } from './exception';

export const httpExceptionConverter = (exception: any, defaultMessage = 'Đã có lỗi xảy ra') => {
    if (exception.name === EXCEPTION.DUPLICATE_KEY_EXCEPTION)
        return new DuplicateKeyException(exception.response.entityName, exception.response.keys);
    if (exception.name === EXCEPTION.NOT_ACCEPTABLE_EXCEPTION) return new NotAcceptableException(exception.response.message);
    if (exception.name === EXCEPTION.CONFLICT_EXCEPTION) return new ConflictException(exception.response.message);

    return new Error(defaultMessage);
};
