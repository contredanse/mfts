import React, { SyntheticEvent } from 'react';
import PageProxy from '@src/models/proxy/page-proxy';

type PagePlaybackOverlayProps = {
    onReplayRequest?: () => void;
    onPlayNextRequest?: () => void;
    nextPage?: PageProxy;
};

type PagePlaybackOverlayState = {};

const defaultState: PagePlaybackOverlayState = {};
const defaultProps = {};

class PagePlaybackOverlay extends React.PureComponent<PagePlaybackOverlayProps, PagePlaybackOverlayState> {
    static defaultProps = defaultProps;

    readonly state: PagePlaybackOverlayState;

    constructor(props: PagePlaybackOverlayProps) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount(): void {}

    componentDidUpdate(prevProps: PagePlaybackOverlayProps, nextState: PagePlaybackOverlayState): void {}

    render() {
        return (
            <div className="page-playback-overlay page-playback-overlay--active">
                <div className="page-playback-overlay-top">The top</div>
                <div className="page-playback-overlay-middle">
                    I'm the center zone
                    <button onClick={this.handleReplayRequest}>Replay</button>
                    {this.props.nextPage && (
                        <>
                            <button onClick={this.handlePlayNextRequest}>Next</button>
                            <img src={this.props.nextPage!.getFirstVideo()!.getFirstCover()} />
                        </>
                    )}
                </div>
                <div className="page-playback-overlay-bottom">Played</div>
            </div>
        );
    }

    private handleReplayRequest = (e: SyntheticEvent<HTMLElement>): void => {
        if (this.props.onReplayRequest) {
            this.props.onReplayRequest();
        }
    };

    private handlePlayNextRequest = (e: SyntheticEvent<HTMLElement>): void => {
        if (this.props.onPlayNextRequest) {
            this.props.onPlayNextRequest();
        }
    };
}

export default PagePlaybackOverlay;
