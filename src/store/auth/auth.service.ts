import { signInWithEmailAndPassword } from 'firebase/auth';
import { has } from 'lodash';
import { auth } from '../../firebase';
import { FIREBASE_TOKEN_KEY } from './auth.constant';

export const loginFirebase = async (email: string, password: string) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
        console.error(err);
        if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found')
            throw new Error('Sai tên tài khoản hoặc mật khẩu');
        if (err.code === 'auth/too-many-requests') throw new Error('Đăng nhập sai quá nhiều lần, vui lòng thử lại sau');

        throw err;
    }
};

export const setLocalStorageToken = (token: string, expiresTime: number) => {
    localStorage.setItem(
        FIREBASE_TOKEN_KEY,
        JSON.stringify({
            token: token,
            tokenExpiresTime: expiresTime,
        }),
    );
};

export const clearLocalStorageToken = () => {
    localStorage.removeItem(FIREBASE_TOKEN_KEY);
};

export const getLocalStorageToken: () => {
    token: string;
    tokenExpiresTime: number;
} = () => {
    const token = localStorage.getItem(FIREBASE_TOKEN_KEY);
    if (!token) return null;

    let parsedToken;
    try {
        parsedToken = JSON.parse(token);
    } catch (err) {
        return null;
    }

    if (!has(parsedToken, 'token') || !has(parsedToken, 'tokenExpiresTime')) return null;
    return parsedToken;
};
