import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import * as uiActions from '@src/store/ui/actions';
import { connect } from 'react-redux';
import ControlBar from '@src/components/player/controls/control-bar';

const mapStateToProps = ({ ui }: ApplicationState) => ({
    isFullscreen: ui.fullscreen,
    isControlbarHidden: ui.isControlbarHidden,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setFullscreen: (isFullscreen: boolean) => dispatch(uiActions.setFullscreen(isFullscreen)),
    setControlbarHidden: (hidden: boolean) => dispatch(uiActions.setControlbarHidden(hidden)),
});

const ConnectedControlBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar);

export default ConnectedControlBar;
