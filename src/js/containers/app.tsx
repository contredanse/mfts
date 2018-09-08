import React from 'react';
import { hot } from 'react-hot-loader';

import { Redirect, Route } from 'react-router-dom';
import { RouteComponentProps, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { I18nextProvider } from 'react-i18next';
import i18n from '@src/i18n/i18n';

import history from '@src/history';
import { AppBar } from '@src/components/app-bar';
import HomeContainer from '@src/containers/home-container';
import MenuContainer from '@src/containers/menu-container';
import NotFoundContainer from '@src/containers/notfound-container';
import AppConfig from '@src/core/app-config';
import PageListContainer from '@src/containers/page-list-container';
import PageContainer from '@src/containers/page-container';
import { DataSupportedLangType } from '@src/models/repository/data-repository';

type AppProps = {
    appConfig: AppConfig;
};

export const LanguageContext = React.createContext({
    language: 'en', // default language is Swahili
    changeLanguage: () => null,
});

export const LanguageConsumer = LanguageContext.Consumer;

export class LanguageProvider extends React.Component<any, any> {
    readonly state: any;
    constructor(props: any) {
        super(props);
        this.state = { language: 'en' };
        this.changeLanguage = this.changeLanguage.bind(this);
    }
    changeLanguage = (): any => {
        console.warn('CHANGE LANGUAGE');
        this.setState({
            language: this.state!.language === 'en' ? 'en' : 'fr',
        });
    };
    render() {
        return (
            <LanguageContext.Provider
                value={{
                    language: this.state.language,
                    changeLanguage: this.changeLanguage,
                }}
            >
                {this.props.children}
            </LanguageContext.Provider>
        );
    }
}

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render(): React.ReactElement<App> {
        const { assetsLocator } = this.props.appConfig;

        // const lang = 'en';

        // Init repositories
        //const videoRepository = this.props.appConfig.getVideoRepository();
        const pageRepository = this.props.appConfig.getPageRepository();
        const menuRepository = this.props.appConfig.getMenuRepository();

        return (
            <LanguageProvider>
                <LanguageConsumer>
                    {({ language, changeLanguage }) => {
                        const lang = language as DataSupportedLangType;
                        return (
                            <I18nextProvider i18n={i18n}>
                                <ConnectedRouter history={history}>
                                    <div className="window-container">
                                        <header>
                                            <AppBar title={i18n.t('appbar.title', { lng: lang })} />
                                            <button
                                                style={{ position: 'absolute', zIndex: 1500, top: '200px' }}
                                                onClick={() => {
                                                    alert('cooo');
                                                    changeLanguage();
                                                }}
                                            >
                                                Lang {lang}
                                            </button>
                                        </header>
                                        <main>
                                            <Switch>
                                                <Route exact={true} path="/" component={HomeContainer} />
                                                <Route
                                                    exact={true}
                                                    path="/:lang(fr|en)?/menu"
                                                    render={(props: RouteComponentProps<any>) => {
                                                        const { lang: routerLang } = props.match.params;
                                                        return (
                                                            <MenuContainer
                                                                lang={routerLang || lang}
                                                                menuRepository={menuRepository}
                                                            />
                                                        );
                                                    }}
                                                />
                                                <Route
                                                    exact={true}
                                                    path="/:lang(fr|en)?/intro"
                                                    render={(props: RouteComponentProps<any>) => {
                                                        const { lang: routerLang } = props.match.params;
                                                        return (
                                                            <PageContainer
                                                                pageId="forms.introduction"
                                                                lang={routerLang || lang}
                                                                pageRepository={pageRepository}
                                                            />
                                                        );
                                                    }}
                                                />
                                                <Route
                                                    exact={true}
                                                    path="/:lang(fr|en)?/page-list"
                                                    render={(props: RouteComponentProps<any>) => {
                                                        return (
                                                            <PageListContainer
                                                                lang={lang}
                                                                videosBaseUrl={assetsLocator.getMediaTypeBaseUrl(
                                                                    'videos'
                                                                )}
                                                                pageRepository={pageRepository}
                                                                {...props}
                                                            />
                                                        );
                                                    }}
                                                />
                                                <Route
                                                    exact={true}
                                                    path="/:lang(fr|en)?/page/:pageId"
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
                                                <Route component={NotFoundContainer} />
                                            </Switch>
                                        </main>
                                    </div>
                                </ConnectedRouter>
                            </I18nextProvider>
                        );
                    }}
                </LanguageConsumer>
            </LanguageProvider>
        );
    }
}

export default hot(module)(App);
