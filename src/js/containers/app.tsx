import React from 'react';
import { hot } from 'react-hot-loader';

import { Route } from 'react-router-dom';
import { RouteComponentProps, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import history from '@src/history';
import { AppBar } from '@src/components/navigation/app-bar';
import HomeContainer from '@src/containers/home-container';
import MenuContainer from '@src/containers/menu-container';
import NotFoundContainer from '@src/containers/notfound-container';
import AppConfig from '@src/core/app-config';
import PageListContainer from '@src/containers/page-list-container';
import PageContainer from '@src/containers/page-container';
import IntroContainer from '@src/containers/intro-container';

import { WithStore } from '@src/hoc/with-store';
import { UiState } from '@src/store/ui';
import AboutContainer from '@src/containers/about-container';
import LoginContainer from '@src/containers/login-container';
import DocumentMeta from '@src/utils/document-meta';
import FullScreen from '@src/utils/fullscreen';

import * as uiActions from '@src/store/ui/actions';
import SideMenu from '@src/components/navigation/side-menu';

type AppProps = {
    appConfig: AppConfig;
};

type AppState = {
    isFullscreen: boolean;
};

const defaultState = {
    isFullscreen: false,
};

class App extends React.Component<AppProps, AppState> {
    readonly state: AppState;

    constructor(props: AppProps) {
        super(props);
        this.state = defaultState;
    }

    public render(): React.ReactElement<App> {
        const { assetsLocator } = this.props.appConfig;

        // Init repositories
        const pageRepository = this.props.appConfig.getPageRepository();
        const menuRepository = this.props.appConfig.getMenuRepository(undefined, pageRepository);

        const localizedRoutes = ({ match }: RouteComponentProps) => {
            const lang = (match.params! as { lang: string }).lang;
            return (
                <Switch>
                    <Route
                        exact={true}
                        path={`${match.path}/menu`}
                        render={() => {
                            return <MenuContainer lang={lang} menuRepository={menuRepository} />;
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/intro`}
                        render={() => {
                            return <IntroContainer lang={lang} pageRepository={pageRepository} />;
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/page-list/:menuId?`}
                        render={(props: RouteComponentProps<any>) => {
                            const { menuId } = props.match.params;
                            return (
                                <PageListContainer
                                    lang={lang}
                                    menuId={menuId}
                                    videosBaseUrl={assetsLocator.getMediaTypeBaseUrl('videos')}
                                    pageRepository={pageRepository}
                                    {...props}
                                />
                            );
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/page/:pageId`}
                        render={(props: RouteComponentProps<any>) => {
                            const { pageId, lang: routeLang } = props.match.params;
                            return (
                                <PageContainer
                                    pageId={pageId}
                                    lang={routeLang || lang}
                                    pageRepository={pageRepository}
                                    menuRepository={menuRepository}
                                    {...props}
                                />
                            );
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/about`}
                        render={() => {
                            return <AboutContainer assetsLocator={assetsLocator} lang={lang} />;
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/login`}
                        render={() => {
                            return <LoginContainer />;
                        }}
                    />

                    <Route component={NotFoundContainer} />
                </Switch>
            );
        };

        return (
            <WithStore selector={state => state.ui}>
                {({ lang, fullscreen, isMenuOpen }: UiState, dispatch) => {
                    //const title = i18n.t('appbar.title', { lng: lang });
                    const title = '';
                    return (
                        <ConnectedRouter history={history}>
                            <FullScreen
                                isFullScreen={fullscreen}
                                onChange={isFullscreen => dispatch(uiActions.setFullscreen(isFullscreen))}
                            >
                                <div id="outer-container">
                                    <SideMenu
                                        isOpen={isMenuOpen}
                                        lang={lang}
                                        onStateChange={state => {
                                            dispatch(uiActions.setIsMenuOpen(state.isOpen));
                                        }}
                                    />
                                    <div className="window-container" id="page-wrap">
                                        <header>
                                            <AppBar
                                                lang={lang}
                                                title={title}
                                                onMenuOpenRequest={() => {
                                                    dispatch(uiActions.setIsMenuOpen(!isMenuOpen));
                                                }}
                                            />
                                        </header>
                                        <main>
                                            <Switch>
                                                <Route
                                                    exact={true}
                                                    path="/"
                                                    render={() => {
                                                        return (
                                                            <DocumentMeta
                                                                title={'Steve Paxton - Material for the spine'}
                                                            >
                                                                <HomeContainer assetsLocator={assetsLocator} />
                                                            </DocumentMeta>
                                                        );
                                                    }}
                                                />
                                                <Route path="/:lang(fr|en)" component={localizedRoutes} />
                                                <Route component={NotFoundContainer} />
                                            </Switch>
                                        </main>
                                    </div>
                                </div>
                            </FullScreen>
                        </ConnectedRouter>
                    );
                }}
            </WithStore>
        );
    }
}

export default (process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
