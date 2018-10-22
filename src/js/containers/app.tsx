import React from 'react';
import { hot } from 'react-hot-loader';

import { Route } from 'react-router-dom';
import { RouteComponentProps, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '@src/i18n/i18n';

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
import DocumentMeta from '@src/shared/document-meta';
import Fullscreen from 'react-full-screen';

import * as uiActions from '@src/store/ui/actions';

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
                {({ lang, fullscreen }: UiState, dispatch) => {
                    //const title = i18n.t('appbar.title', { lng: lang });
                    const title = '';
                    return (
                        <I18nextProvider i18n={i18n}>
                            <ConnectedRouter history={history}>
                                <Fullscreen
                                    enabled={fullscreen}
                                    onChange={isFullscreen => dispatch(uiActions.setFullscreen(isFullscreen))}
                                >
                                    <div className="window-container full-screenable-node">
                                        <header>
                                            <AppBar lang={lang} title={title} />
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
                                        <button
                                            style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 1000 }}
                                            onClick={() => {
                                                console.log('DISPATCH', dispatch);
                                                dispatch(uiActions.setFullscreen(!fullscreen));
                                            }}
                                        >
                                            {fullscreen ? 'Exit fullscreen' : 'Go fullscreen'}
                                        </button>
                                    </div>
                                </Fullscreen>
                            </ConnectedRouter>
                        </I18nextProvider>
                    );
                }}
            </WithStore>
        );
    }
}

export default (process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
