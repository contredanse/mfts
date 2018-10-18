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
    onPageRequest?: (pageId: string) => void;
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
    play_previous_page: {
        en: 'Previous page',
        fr: 'Page précédente',
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
                    {p.previousPage && (
                        <div
                            className="action-item"
                            onClick={() => {
                                this.handlePageRequest(p.previousPage!.pageId);
                            }}
                        >
                            <PageCard pageProxy={p.previousPage!} lang={lang} />
                            <div className="action-overlay">
                                <div>{getFromDictionary('play_previous_page', lang!, i18nDict)}</div>
                            </div>
                        </div>
                    )}

                    {currentPage && (
                        <div className="action-item" onClick={this.handleReplayRequest}>
                            <PageCard pageProxy={currentPage!} lang={lang} />
                            <div className="action-overlay">
                                <div>{getFromDictionary('replay_page', lang!, i18nDict)}</div>
                            </div>
                        </div>
                    )}

                    {p.nextPage && (
                        <div
                            className="action-item"
                            onClick={() => {
                                this.handlePageRequest(p.nextPage!.pageId);
                            }}
                        >
                            <PageCard pageProxy={p.nextPage!} lang={lang} />
                            <div className="action-overlay">
                                <div>{getFromDictionary('play_next_page', lang!, i18nDict)}</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="page-playback-overlay-bottom">Bottom</div>
            </div>
        );
    }

    private handleReplayRequest = (): void => {
        if (this.props.onReplayRequest) {
            this.props.onReplayRequest();
        }
    };

    private handlePageRequest = (pageId: string): void => {
        if (this.props.onPageRequest) {
            this.props.onPageRequest(pageId);
        }
    };
}

export default PagePlaybackOverlay;
