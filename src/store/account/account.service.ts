import { httpExceptionConverter } from '../../exception/http-exception.converter';
import { destineeApi } from '../../https';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { AccountUpdateDisabledREQ } from '../../model/account/request/account-update-disabled.request';
import { AccountUpdatePasswordREQ } from '../../model/account/request/account-update-password.request';
import { AccountCreateREQ } from '../../model/account/request/account-create.request';
import { AccountCreateRESP } from '../../model/account/response/account-create.response';
import { AccountRESP } from '../../model/account/response/account-response';
import { ROLE } from '../../model/account/roles.enum';
import { ORDER_BY } from '../../model/order-by.enum';
import { PaginationRESP } from '../../model/pagination.response';

export const fetchAccounts = async (
    limit?: number,
    page?: number,
    orderBy?: ORDER_BY,
    sortBy?: string,
    search?: string,
    role?: ROLE,
    disabled?: boolean,
) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<AccountRESP>>(`/accounts`, {
                params: { limit, page, orderBy, sortBy, search, role, disabled },
            })
        ).data;
        return {
            accounts: data.results.map(
                (account) =>
                    ({
                        id: account._id,
                        profileId: account.profile?._id,
                        email: account.email,
                        role: account.role,
                        uid: account.uid,
                        disabled: account.disabled,
                        createdAt: account.createdAt,
                    } as AccountDTO),
            ),
            page: data.page,
            totalPage: data.totalPage,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách tài khoản');
    }
};

export const fetchMyAccount = async () => {
    try {
        const data = (await destineeApi.get<AccountRESP>(`/accounts/my-account`)).data;
        return {
            id: data._id,
            profileId: data.profile?._id,
            email: data.email,
            role: data.role,
            uid: data.uid,
            disabled: data.disabled,
            createdAt: data.createdAt,
        } as AccountDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải tài khoản của tôi');
    }
};

export const changeAccountPassword = async (id: string, body: AccountUpdatePasswordREQ) => {
    try {
        await destineeApi.patch(`/accounts/${id}/password`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi đổi mật khẩu');
    }
};

export const updateAccountDisabled = async (id: string, body: AccountUpdateDisabledREQ) => {
    try {
        await destineeApi.patch(`/accounts/${id}/disabled`, body);
        return id;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi cập nhật trạng thái tài khoản');
    }
};

export const createAccount = async (body: AccountCreateREQ) => {
    try {
        const data = (await destineeApi.post<AccountCreateRESP>(`/accounts`, body)).data;
        return {
            id: data._id,
            uid: data.uid,
            email: data.email,
            role: data.role,
            disabled: data.disabled,
            createdAt: data.createdAt,
        } as AccountDTO;
    } catch (err: any) {
        console.error(err);
        const firebaseErrorCode = err.response?.data?.response?.detail?.code;
        const firebaseErrorMsg = err.response?.data?.response?.detail?.message;
        if (firebaseErrorCode && firebaseErrorCode === 'auth/invalid-email') throw new Error('Email không hợp lệ');
        if (firebaseErrorCode && firebaseErrorCode === 'auth/email-already-exists') throw new Error('Email đã tồn tại');
        if (firebaseErrorCode && firebaseErrorCode === 'auth/internal-error') throw new Error(firebaseErrorMsg);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tạo tài khoản');
    }
};

export const fetchAccount = async (id: string) => {
    try {
        const data = (await destineeApi.get<AccountRESP>(`/accounts/${id}`)).data;
        return {
            id: data._id,
            profileId: data.profile?._id,
            email: data.email,
            role: data.role,
            uid: data.uid,
            disabled: data.disabled,
            createdAt: data.createdAt,
        } as AccountDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải tài khoản');
    }
};