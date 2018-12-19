import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import './login-button.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import { getMainMenuRoute } from '@src/helpers/main-menu-redirect';
import ReactSVG from 'react-svg';
import helixSvg from '@assets/svg/helix-contredanse.svg';
import { grepPageIdFromRoute } from '@src/helpers/route-utils';

type MenuButtonProps = {
    lang: string;
    className?: string;
    route?: string;
} & RouteComponentProps<{}>;

type MenuButtonState = {};

const defaultProps = {
    className: 'helix-menu-icon mdi-icon',
};

export class MenuButton extends React.PureComponent<MenuButtonProps, MenuButtonState> {
    static defaultProps = defaultProps;

    constructor(props: MenuButtonProps) {
        super(props);
    }

    handleClick = () => {
        const { lang, history, route } = this.props;
        const pageId = grepPageIdFromRoute(route);
        const newRoute = getMainMenuRoute(lang, pageId);
        history.push(newRoute);
    };

    render() {
        const { lang, className } = this.props;
        return (
            <button className={className} onClick={this.handleClick}>
                <ReactSVG src={helixSvg} />
            </button>
        );
    }
}

const mapStateToProps = ({ nav }: ApplicationState) => ({
    route: nav.currentLocation,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

const ConnectedMenuButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuButton);

export default withRouter(ConnectedMenuButton);
