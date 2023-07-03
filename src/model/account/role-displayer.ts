import { ROLE } from './roles.enum';
export const roleDisplayer: { [key in ROLE]: { displayer: string; color?: string } } = {
    ADMIN: { displayer: 'Quản trị viên', color: 'orange' },
    USER: { displayer: 'Người dùng', color: undefined },
};

export const ROLE_LABEL = 'Chức vụ';