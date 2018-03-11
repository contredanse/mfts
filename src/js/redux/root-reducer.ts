import { combineReducers } from 'redux';
import { routerReducer, RouterState } from 'react-router-redux';

interface StoreEnhancerState {}

export interface RootState extends StoreEnhancerState {
    router: RouterState;
}

import { RootAction } from '@src/redux';
export const rootReducer = combineReducers<RootState, RootAction>({
    router: routerReducer,
});
