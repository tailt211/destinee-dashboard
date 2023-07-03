import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from './features/account/AccountPage';
import CallHistoryPage from './features/call-history/CallHistoryPage';
import CallQuestionPage from './features/call-question/CallQuestionPage';
import HomePage from './features/home/HomePage';
import DashboardLayout from './features/layout/DashboardLayout';
import LoginPage from './features/login/LoginPage';
import MbtiTestPage from './features/mbti-test/MbtiTestPage';
import NotFoundPage from './features/not-found/NotFoundPage';
import OrderPage from './features/order/OrderPage';
import PaymentPage from './features/payment/PaymentPage';
import ProfilePage from './features/profile/ProfilePage';
import useAuth from './hooks/use-auth';
import useToastGlobal from './hooks/use-toast-global';
import { PATHS } from './router/paths';

export const App = () => {
    useToastGlobal();
    useAuth();

    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route path="" element={<Navigate to={`/${PATHS.HOME}`} replace />} />
                {/* <Route index element={<HomePage />} /> */}
                <Route path={PATHS.HOME} element={<HomePage />} />
                <Route path={PATHS.ACCOUNT} element={<AccountPage />} />
                <Route path={PATHS.PROFILE} element={<ProfilePage />} />
                <Route path={PATHS.CALL_QUESTION} element={<CallQuestionPage />} />
                <Route path={PATHS.CALL_HISTORY} element={<CallHistoryPage />} />
                <Route path={PATHS.MBTI} element={<MbtiTestPage />} />
                <Route path={PATHS.ORDER} element={<OrderPage />} />
                <Route path={PATHS.PAYMENT} element={<PaymentPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};
