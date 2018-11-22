import React from 'react';
import fscreen from 'fscreen';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as uiActions from '@src/store/ui/actions';

type FullScreenProps = {
    children: React.ReactNode;
    isFullScreen: boolean;
    onChange: (isFullscreen: boolean) => void;
};

const defaultProps = {
    isFullScreen: false,
};

class FullScreen extends React.Component<FullScreenProps> {
    static defaultProps = defaultProps;

    private screenCtnRef!: React.RefObject<HTMLDivElement>;

    constructor(props: FullScreenProps) {
        super(props);
        this.screenCtnRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        fscreen.addEventListener('fullscreenchange', this.detectFullScreen);
    }

    componentWillUnmount() {
        fscreen.removeEventListener('fullscreenchange', this.detectFullScreen);
    }

    componentDidUpdate() {
        this.handleProps(this.props);
    }

    detectFullScreen = (): void => {
        if (this.props.onChange) {
            this.props.onChange(!!fscreen.fullscreenElement);
        }
    };

    enterFullScreen = (): void => {
        if (fscreen.fullscreenEnabled) {
            if (this.screenCtnRef.current) {
                fscreen.requestFullscreen(this.screenCtnRef.current);
            }
        }
    };

    leaveFullScreen = (): void => {
        if (fscreen.fullscreenEnabled) {
            fscreen.exitFullscreen();
        }
    };

    handleProps(props: FullScreenProps) {
        const enabled = fscreen.fullscreenElement;
        if (enabled && !props.isFullScreen) {
            this.leaveFullScreen();
        } else if (!enabled && props.isFullScreen) {
            this.enterFullScreen();
        }
    }

    render() {
        const className = ['fullscreen'];
        if (this.props.isFullScreen) {
            className.push('fullscreen-enabled');
        }

        return (
            <div
                className={className.join(' ')}
                ref={this.screenCtnRef}
                style={this.props.isFullScreen ? { height: '100%', width: '100%' } : undefined}
            >
                {this.props.children}
            </div>
        );
    }
}

export default FullScreen;

const mapStateToProps = ({ ui }: ApplicationState) => ({
    //authError: auth.authError,
    //loading: auth.loading,
    isFullScreen: ui.fullscreen,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onChange: (isFullscreen: boolean) => dispatch(uiActions.setFullscreen(isFullscreen)),
});

export const ConnectedFullScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(FullScreen);
