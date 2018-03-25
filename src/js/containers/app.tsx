import React from 'react';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { history } from '@src/store';

import { RouteComponentProps, Switch } from 'react-router';
import { AppBarConnected } from '@src/components/app-bar-connected';
import HomePage from '@src/containers/home-container';
import IntroPage from '@src/containers/intro-container';
import MenuPage from '@src/containers/menu-container';
import NotFoundPage from '@src/containers/notfound-container';
import VideoListPage from '@src/containers/video-list-container';
import { AppConfig } from '@config/app-config';
import PageListPage from '@src/containers/page-list-container';
import PageContainer from '@src/containers/page-container';

interface IAppProps {
    appConfig: AppConfig;
}

class App extends React.Component<IAppProps, {}> {
    public render(): React.ReactElement<App> {
        const { videosBaseUrl, data } = this.props.appConfig.getConfig();
        const lang = 'en';
        return (
            <ConnectedRouter history={history}>
                <div className="page-container">
                    <header>
                        <AppBarConnected title="" />
                    </header>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" component={HomePage} />
                            <Route exact={true} path="/intro" component={IntroPage} />
                            <Route exact={true} path="/menu" component={MenuPage} />
                            <Route
                                exact={true}
                                path="/page-list"
                                render={props => {
                                    return (
                                        <PageListPage
                                            lang={lang}
                                            initialData={data.pages}
                                            videosBaseUrl={videosBaseUrl}
                                            {...props}
                                        />
                                    );
                                }}
                            />
                            <Route
                                exact={true}
                                path="/video-list"
                                render={props => (
                                    <VideoListPage initialData={data.videos} videosBaseUrl={videosBaseUrl} {...props} />
                                )}
                            />
                            <Route
                                exact={true}
                                path="/page/:pageId"
                                render={(props: RouteComponentProps<any>) => {
                                    console.log('params', props);
                                    const { params } = props.match;
                                    return <PageContainer pageId={params.pageId} />;
                                }}
                            />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </main>
                </div>
            </ConnectedRouter>
        );
    }
}

export default hot(module)(App);
