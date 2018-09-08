import { RouterAction } from 'connected-react-router';
import { LocationChangeAction } from '../../typings/connected-router-extra';

declare module 'Types' {
    //export type RootState = StateType<typeof rootReducer>;
    //export type RootAction = ReactRouterAction;
    export type ReactRouterAction = RouterAction | LocationChangeAction;
}
