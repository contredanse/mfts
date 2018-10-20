import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as navActions from '@src/store/nav/actions';
import { RouteComponentProps, withRouter } from 'react-router';
import { NavBreadcrumbProps, NavState } from '@src/store/nav';

// Props passed from mapStateToProps
type PropsFromReduxState = {
    navBreadcrumb?: NavBreadcrumbProps;
};

// Props passed from mapDispatchToProps
type PropsFromReduxDispatchActions = {
    setPageBreadcrumb: typeof navActions.setPageBreadcrumb;
};

type NavProviderProps = PropsFromReduxDispatchActions &
    PropsFromReduxState &
    RouteComponentProps<any> & {
        children(props: {
            navBreadcrumb?: NavBreadcrumbProps;
            setPageBreadcrumb: (breadcrumb?: NavBreadcrumbProps) => void;
        }): JSX.Element;
    };

const defaultProps = {};

export class NavProvider extends React.Component<NavProviderProps> {
    static defaultProps = defaultProps;

    constructor(props: NavProviderProps) {
        super(props);
    }

    render() {
        const { navBreadcrumb, setPageBreadcrumb, children } = this.props;
        return children({
            navBreadcrumb: navBreadcrumb,
            setPageBreadcrumb: setPageBreadcrumb,
        });
    }
}
const mapStateToProps = ({ navBreadcrumb }: NavState) => ({
    navBreadcrumb,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setPageBreadcrumb: (breadcrumb?: NavBreadcrumbProps) => dispatch(navActions.setPageBreadcrumb(breadcrumb)),
});

const ConnectedNavProvider = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(NavProvider)
);
export default ConnectedNavProvider;
