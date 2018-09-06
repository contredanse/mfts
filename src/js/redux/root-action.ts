import { RouterAction } from 'connected-react-router';
import { LocationChangeAction } from '../../typings/connected-router-extra';

type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction = ReactRouterAction;
