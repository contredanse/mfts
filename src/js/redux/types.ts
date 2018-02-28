import {
    Dispatch as ReduxDispatch,
    Reducer as ReduxReducer,
} from 'redux';

import { RootState, RootAction } from '@src/redux';

export type Dispatch = ReduxDispatch<RootAction>;
export type Reducer = ReduxReducer<RootState, RootAction>;
