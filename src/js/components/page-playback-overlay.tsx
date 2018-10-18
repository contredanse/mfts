import React, { SyntheticEvent } from 'react';
import PageProxy from '@src/models/proxy/page-proxy';

import './page-playback-overlay.scss';
import { BasicI18nDictionary, getFromDictionary } from '@src/i18n/basic-i18n';
import PageCard from '@src/components/page-card';
import MenuRepository from '@src/models/repository/menu-repository';

type PagePlaybackOverlayProps = {
    currentPage: PageProxy;
    menuRepository: MenuRepository;
    lang?: string;
    onReplayRequest?: () => void;
    onPlayNextRequest?: () => void;
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
        const { currentPage, lang } = this.props;
        const p = this.props.menuRepository.getPrevAndNextPageEntityMenu(currentPage.pageId, lang!);
        return (
            <div className="page-playback-overlay page-playback-overlay--active">
                <div className="page-playback-overlay-top">The top</div>
                <div className="page-playback-overlay-middle">
                    {currentPage && (
                        <PageCard pageProxy={currentPage!} lang={lang} onClick={this.handleReplayRequest} />
                    )}
                    {p.nextPage && (
                        <PageCard pageProxy={p.nextPage!} lang={lang} onClick={this.handlePlayNextRequest} />
                    )}

                    <div className="actions-wrapper">
                        <button onClick={this.handleReplayRequest}>
                            {getFromDictionary('replay_page', lang!, i18nDict)}
                        </button>
                        {p.nextPage && (
                            <button onClick={this.handlePlayNextRequest}>
                                {getFromDictionary('play_next_page', lang!, i18nDict)}
                            </button>
                        )}
                    </div>
                </div>
                <div className="page-playback-overlay-bottom">Played</div>
            </div>
        );
    }

    private handleReplayRequest = (): void => {
        if (this.props.onReplayRequest) {
            this.props.onReplayRequest();
        }
    };

    private handlePlayNextRequest = (): void => {
        if (this.props.onPlayNextRequest) {
            this.props.onPlayNextRequest();
        }
    };
}

export default PagePlaybackOverlay;
