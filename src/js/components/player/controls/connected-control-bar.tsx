import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import * as uiActions from '@src/store/ui/actions';
import { connect } from 'react-redux';
import ControlBar from '@src/components/player/controls/control-bar';

const mapStateToProps = ({ ui }: ApplicationState) => ({
    isFullscreen: ui.fullscreen,
    extraClasses: ui.isIdleMode ? 'idle-mode' : undefined,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    handleFullscreenRequest: (isFullscreen: boolean) => dispatch(uiActions.setFullscreen(isFullscreen)),
    handleIdleModeChange: (idleMode: boolean) => dispatch(uiActions.setIdleMode(idleMode)),
});

const ConnectedControlBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar);

export default ConnectedControlBar;
