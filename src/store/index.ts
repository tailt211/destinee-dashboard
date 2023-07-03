import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import profileReducer from './profile/profile.slice';
import accountReducer from './account/account.slice';
import callHistoryReducer from './call-history/call-history.slice';
import statisticsReducer from './statistics/statistics.slice';
import callQuestionReducer from './call-question/call-question.slice';
import mbtiTestReducer from './mbti-test/mbti-test.slice';
import orderReducer from './order/order.slice';
import paymentReducer from './payment/payment.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        account: accountReducer,
        callHistory: callHistoryReducer,
        statistics: statisticsReducer,
        callQuestion: callQuestionReducer,
        mbtiTest: mbtiTestReducer,
        order: orderReducer,
        payment: paymentReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
