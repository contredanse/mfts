import { RouterAction, LocationChangeAction } from 'connected-react-router';

declare module 'Types' {
    export type ReactRouterAction = RouterAction | LocationChangeAction;
}
