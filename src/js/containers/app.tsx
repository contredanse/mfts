import React from 'react';

import { hot } from 'react-hot-loader/root';

import { Route } from 'react-router-dom';
import { RouteComponentProps, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import history from '@src/history';
import { ConnectedAppBar } from '@src/components/navigation/app-bar';
import AppConfig from '@src/core/app-config';
import DocumentMeta from '@src/utils/document-meta';
import { ConnectedFullScreen } from '@src/utils/fullscreen';
import { ConnectedSideMenu } from '@src/components/navigation/side-menu';
import { LanguageContext, LanguageContextProvider } from '@src/context/language-context';
import HomeContainer from './home-container';
import NotFoundContainer from './notfound-container';
import LoginContainer from './login-container';
import MenuContainer from './menu-container';
import PageContainer from './page-container';
import PageListContainer from './page-list-container';
import WelcomeContainer from './welcome-container';
import IntroContainer from './intro-container';
import AboutContainer from './about-container';

type AppProps = {
    appConfig: AppConfig;
};

type AppState = {
    isFullscreen: boolean;
};

const defaultState = {
    isFullscreen: false,
};

class App extends React.PureComponent<AppProps, AppState> {
    readonly state: AppState;

    constructor(props: AppProps) {
        super(props);
        this.state = defaultState;
    }

    public render(): React.ReactElement<App> {
        const { assetsLocator } = this.props.appConfig;

        // Init repositories
        const pageRepository = this.props.appConfig.getPageRepository();
        const menuRepository = this.props.appConfig.getMenuRepository(pageRepository);

        const localizedRoutes = ({ match }: RouteComponentProps) => {
            const lang = (match.params as { lang: string }).lang;
            return (
                <Switch>
                    <Route
                        exact={true}
                        path={`${match.path}/menu/:pageId?`}
                        render={(props: RouteComponentProps<any>) => {
                            const { pageId } = props.match.params;
                            return <MenuContainer lang={lang} menuRepository={menuRepository} openedPageId={pageId} />;
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
                        path={`${match.path}/welcome/:pageId?`}
                        render={(props: RouteComponentProps<any>) => {
                            const { pageId, lang: routeLang } = props.match.params;
                            return (
                                <WelcomeContainer
                                    lang={routeLang}
                                    pageRepository={pageRepository}
                                    fromPageId={pageId}
                                />
                            );
                        }}
                    />
                    <Route
                        exact={true}
                        path={`${match.path}/page-list/:menuId?`}
                        render={(props: RouteComponentProps<any>) => {
                            const { lang: routeLang, menuId } = props.match.params;
                            return (
                                <PageListContainer
                                    lang={routeLang}
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
                        path={`${match.path}/about/:section`}
                        render={(props: RouteComponentProps<any>) => {
                            const { section, lang: routeLang } = props.match.params;
                            return <AboutContainer assetsLocator={assetsLocator} lang={routeLang} section={section} />;
                        }}
                    />

                    <Route
                        exact={true}
                        path={`${match.path}/login`}
                        render={() => {
                            return <LoginContainer lang={lang} />;
                        }}
                    />
                    <Route component={NotFoundContainer} />
                </Switch>
            );
        };

        return (
            <LanguageContextProvider>
                <LanguageContext.Consumer>
                    {({ lang }) => {
                        const title = '';
                        return (
                            <ConnectedRouter history={history}>
                                <ConnectedFullScreen>
                                    <div id="outer-container">
                                        <ConnectedSideMenu lang={lang} />
                                        <div className="window-container" id="page-wrap">
                                            <header>
                                                <ConnectedAppBar lang={lang} title={title} />
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
                                </ConnectedFullScreen>
                            </ConnectedRouter>
                        );
                    }}
                </LanguageContext.Consumer>
            </LanguageContextProvider>
        );
    }
}

// Could be also: export default (process.env.NODE_ENV === 'development' ? hot(App) : App);
// to save few bytes

export default hot(App);
