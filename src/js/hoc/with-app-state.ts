/*
import { connect } from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../store';
import {Dispatch} from 'redux';
import * as langActions from '../store/locale/actions';
import {ReactElement} from 'react';


interface OuterProps {
    children: (state: any, dispatch: Dispatch<any>) => ReactElement<any>;
   // selector?: (state: any) => any;
}

interface InnerProps extends OuterProps {
    state: any;
    dispatch: Dispatch<any>;
}

const WithAppStateInner = ({ children, state, dispatch }:InnerProps) => children(state, dispatch);

const mapStateToProps = ({ lang: lg }: any) => ({
    uiLanguage: lg.lang,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateUILanguage: (lang: string) => dispatch(langActions.setLang(lang)),
});

export const WithAppState = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WithAppStateInner) as React.ComponentClass<OuterProps> ;

*/
