import { connect } from 'react-redux';

import { RootState } from '@src/redux/index';
import { AppBar } from '@src/components';
import { withRouter } from 'react-router';

const mapStateToProps = (state: RootState) => ({
    // mediaInfo: state.media.mediaInfo,
});

const mapDispatchToProps = (dispatch: any) => ({
    // dispatch
});
export const AppBarConnected = withRouter(connect(mapStateToProps, mapDispatchToProps)(AppBar));
