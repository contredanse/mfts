import { RouterAction, LocationChangeAction } from 'connected-react-router';

declare module 'Types' {
    //export type RootState = StateType<typeof rootReducer>;
    //export type RootAction = ReactRouterAction;
    export type ReactRouterAction = RouterAction | LocationChangeAction;
}
