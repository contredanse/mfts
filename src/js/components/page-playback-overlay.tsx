import React, { SyntheticEvent } from 'react';
import PageProxy from '@src/models/proxy/page-proxy';

import './page-playback-overlay.scss';
import { BasicI18nDictionary, getFromDictionary } from '@src/i18n/basic-i18n';

type PagePlaybackOverlayProps = {
    lang?: string;
    onReplayRequest?: () => void;
    onPlayNextRequest?: () => void;
    nextPage?: PageProxy;
};

type PagePlaybackOverlayState = {};

const defaultState: PagePlaybackOverlayState = {};
const defaultProps = {
    lang: 'en',
};

const i18nDict: BasicI18nDictionary = {
    replay_page: {
        en: 'Replay',
        fr: 'Rejouer',
    },
    play_next_page: {
        en: 'Next page',
        fr: 'Page suivante',
    },
};

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
        const { nextPage, lang } = this.props;

        return (
            <div className="page-playback-overlay page-playback-overlay--active">
                <div className="page-playback-overlay-top">The top</div>
                <div className="page-playback-overlay-middle">
                    I'm the center zone
                    <button onClick={this.handleReplayRequest}>
                        {getFromDictionary('replay_page', lang!, i18nDict)}
                    </button>
                    {nextPage && (
                        <>
                            <button onClick={this.handlePlayNextRequest}>
                                {getFromDictionary('play_next_page', lang!, i18nDict)}
                            </button>
                            <img src={nextPage.getFirstVideo()!.getFirstCover()} />
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
