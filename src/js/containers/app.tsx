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
import { LangState } from '@src/store/locale';
import AboutContainer from '@src/containers/about-container';
import LoginContainer from '@src/containers/login-container';
import ConnectedLangSelector from '@src/components/lang-selector';
import DocumentMeta from '@src/shared/document-meta';

type AppProps = {
    appConfig: AppConfig;
};

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render(): React.ReactElement<App> {
        const { assetsLocator } = this.props.appConfig;

        // Init repositories
        const pageRepository = this.props.appConfig.getPageRepository();
        const menuRepository = this.props.appConfig.getMenuRepository();

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
            <WithStore selector={state => state.lang}>
                {({ lang }: LangState, dispatch) => {
                    //const title = i18n.t('appbar.title', { lng: lang });
                    const title = '';
                    return (
                        <I18nextProvider i18n={i18n}>
                            <ConnectedRouter history={history}>
                                <div className="window-container">
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
                                                        <DocumentMeta title={'Steve Paxton - Material for the spine'}>
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
                            </ConnectedRouter>
                        </I18nextProvider>
                    );
                }}
            </WithStore>
        );
    }
}

export default (process.env.NODE_ENV === 'development' ? hot(module)(App) : App);
