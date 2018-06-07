import React from 'react';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { history } from '@src/store';

import { RouteComponentProps, Switch } from 'react-router';
import { AppBar } from '@src/components/app-bar';
import HomeContainer from '@src/containers/home-container';
import MenuContainer from '@src/containers/menu-container';
import NotFoundContainer from '@src/containers/notfound-container';
import AppConfig from '@src/core/app-config';
import PageListContainer from '@src/containers/page-list-container';
import PageContainer from '@src/containers/page-container';
import LocalDataRepository from '@src/models/repository/local-data-repository';

type AppProps = {
    appConfig: AppConfig;
};

class App extends React.Component<AppProps, {}> {
    constructor(props: AppProps) {
        super(props);
    }

    public render(): React.ReactElement<App> {
        const { assetsLocator } = this.props.appConfig;
        const data = this.props.appConfig.getAppData();
        const lang = 'en';

        const dataRepository = this.props.appConfig.getDataRepository();
        const videoRepository = this.props.appConfig.getVideoRepository();

        console.log('videoRepository', videoRepository);

        return (
            <ConnectedRouter history={history}>
                <div className="window-container">
                    <header>
                        <AppBar title="" />
                    </header>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" component={HomeContainer} />
                            <Route exact={true} path="/menu" component={MenuContainer} />

                            <Route
                                exact={true}
                                path="/:lang(fr|en)?/intro"
                                render={(props: RouteComponentProps<any>) => {
                                    const { pageId, lang: routeLang } = props.match.params;
                                    return (
                                        <PageContainer
                                            pageId="forms.introduction"
                                            lang={routeLang || lang}
                                            dataRepository={dataRepository}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/page-list"
                                render={(props: RouteComponentProps<any>) => {
                                    return (
                                        <PageListContainer
                                            lang={lang}
                                            videosBaseUrl={assetsLocator.getMediaTypeBaseUrl('videos')}
                                            dataRepository={dataRepository as LocalDataRepository}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/page/:lang(fr|en)?/:pageId"
                                render={(props: RouteComponentProps<any>) => {
                                    const { pageId, lang: routeLang } = props.match.params;
                                    return (
                                        <PageContainer
                                            pageId={pageId}
                                            lang={routeLang || lang}
                                            dataRepository={dataRepository}
                                        />
                                    );
                                }}
                            />
                            <Route component={NotFoundContainer} />
                        </Switch>
                    </main>
                </div>
            </ConnectedRouter>
        );
    }
}

export default hot(module)(App);
