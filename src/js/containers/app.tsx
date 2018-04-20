import React from 'react';
import { hot } from 'react-hot-loader';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router-dom';
import { history } from '@src/store';

import { RouteComponentProps, Switch } from 'react-router';
import { AppBarConnected } from '@src/components/app-bar-connected';
import HomeContainer from '@src/containers/home-container';
import IntroContainer from '@src/containers/intro-container';
import MenuContainer from '@src/containers/menu-container';
import NotFoundContainer from '@src/containers/notfound-container';
import VideoListContainer from '@src/containers/video-list-container';
import { AppConfig } from '@config/app-config';
import PageListContainer from '@src/containers/page-list-container';
import PageContainer from '@src/containers/page-container';
import PageRepository from '@src/repositories/page-repository';

interface IAppProps {
    appConfig: AppConfig;
}

class App extends React.Component<IAppProps, {}> {
    constructor(props: IAppProps) {
        super(props);
    }

    public render(): React.ReactElement<App> {
        const { videosBaseUrl, data } = this.props.appConfig.getConfig();
        const lang = 'en';
        const pageRepository = new PageRepository(data.pages);

        return (
            <ConnectedRouter history={history}>
                <div className="window-container">
                    <header>
                        <AppBarConnected title="" />
                    </header>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" component={HomeContainer} />
                            <Route exact={true} path="/intro" component={IntroContainer} />
                            <Route exact={true} path="/menu" component={MenuContainer} />
                            <Route
                                exact={true}
                                path="/page-list"
                                render={props => {
                                    return (
                                        <PageListContainer
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
                                    <VideoListContainer
                                        initialData={data.videos}
                                        videosBaseUrl={videosBaseUrl}
                                        {...props}
                                    />
                                )}
                            />
                            <Route
                                exact={true}
                                path="/page/:pageId"
                                render={(props: RouteComponentProps<any>) => {
                                    const { pageId } = props.match.params;
                                    return <PageContainer pageId={pageId} pageRepository={pageRepository} />;
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
