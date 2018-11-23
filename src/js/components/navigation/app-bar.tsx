import React from 'react';

import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import './app-bar.scss';

import MenuIcon from 'mdi-react/MenuIcon';

import helixSvg from '@assets/svg/helix-contredanse.svg';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as uiActions from '@src/store/ui/actions';
import { isScreenAdaptedForHelixMenu, getMainMenuRoute } from '@src/helpers/main-menu-redirect';

type AppBarProps = {
    title: string;
    lang: string;
    hidden?: boolean;
    onMenuOpenRequest?: () => void;
    extraClasses?: string;
};

type AppBarWithRouterProps = AppBarProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppBarWithRouterProps> = props => {
    const { history, lang, onMenuOpenRequest, hidden } = props;

    const classes = [props.extraClasses, hidden ? 'hidden' : undefined].join(' ');

    return (
        <div className={`${['app-bar-container', classes].join(' ')}`}>
            <button
                className="mdi-icon"
                onClick={() => {
                    if (onMenuOpenRequest) {
                        onMenuOpenRequest();
                    } else {
                        history.push('/');
                    }
                }}
            >
                <MenuIcon />
            </button>

            <button
                className="mdi-icon"
                onClick={() => {
                    history.push(getMainMenuRoute(lang));
                }}
            >
                <img src={helixSvg} style={{ fill: 'white' }} />
            </button>

            <div id="app-bar-portal-ctn" className="app-bar-portal" />
        </div>
    );
};

export default withRouter(AppBarComponent);

const mapStateToProps = ({ ui }: ApplicationState) => ({
    hidden: ui.isMenuOpen,
    extraClasses: ui.isIdleMode ? 'idle-mode' : undefined,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onMenuOpenRequest: () => dispatch(uiActions.setIsMenuOpen(true)),
});

export const ConnectedAppBar = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppBarComponent)
);
