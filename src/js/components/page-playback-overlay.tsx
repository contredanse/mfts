import React from 'react';
import PageProxy from '@src/models/proxy/page-proxy';

import './page-playback-overlay.scss';
import { BasicI18nDictionary } from '@src/i18n/basic-i18n';
import PageCard from '@src/components/page-card';
import MenuRepository from '@src/models/repository/menu-repository';

import ReplayIcon from 'mdi-react/ReplayIcon';
import PreviousIcon from 'mdi-react/SkipPreviousIcon';
import NextIcon from 'mdi-react/SkipNextIcon';
import { RouteComponentProps, withRouter } from 'react-router';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import * as uiActions from '@src/store/ui/actions';
import { connect } from 'react-redux';

type PagePlaybackOverlayProps = {
    currentPage: PageProxy;
    menuRepository: MenuRepository;
    lang?: string;
    onReplayRequest?: () => void;
    onPageRequest?: (pageId: string) => void;
    onRendered?: () => void;
} & RouteComponentProps<any>;

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

    componentDidMount(): void {
        const { onRendered } = this.props;
        if (onRendered) {
            onRendered();
        }
    }

    componentDidUpdate(prevProps: PagePlaybackOverlayProps, nextState: PagePlaybackOverlayState): void {}

    render() {
        const { currentPage, lang } = this.props;
        const p = this.props.menuRepository.getPrevAndNextPageEntityMenu(currentPage.pageId, lang!);
        return (
            <div className="page-playback-overlay page-playback-overlay--active">
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
                                <div>
                                    <PreviousIcon size="100%" />
                                </div>

                                {/*<div>{getFromDictionary('play_previous_page', lang!, i18nDict)}</div>*/}
                            </div>
                        </div>
                    )}

                    {currentPage && (
                        <div className="action-item" onClick={this.handleReplayRequest}>
                            <PageCard pageProxy={currentPage!} lang={lang} />
                            <div className="action-overlay">
                                <div>
                                    <ReplayIcon size="100%" />
                                </div>
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
                                <div>
                                    <NextIcon size="100%" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    handleReplayRequest = (): void => {
        if (this.props.onReplayRequest) {
            this.props.onReplayRequest();
        }
    };

    handlePageRequest = (pageId: string): void => {
        if (this.props.onPageRequest) {
            this.props.onPageRequest(pageId);
        }
    };
}

export default withRouter(PagePlaybackOverlay);

const mapStateToProps = ({ ui }: ApplicationState) => ({
    extraClasses: ui.isIdleMode ? 'idle-mode' : undefined,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onRendered: () => dispatch(uiActions.setIdleMode(false)),
});

export const ConnectedPagePlaybackOverlay = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PagePlaybackOverlay)
);
