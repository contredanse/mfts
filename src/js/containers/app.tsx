import React from 'react';
import {hot} from 'react-hot-loader';
import {ConnectedRouter} from 'react-router-redux';
import {Route} from 'react-router-dom';
import { history } from '@src/store';

import {Switch} from 'react-router';
import { AppBarConnected } from '@src/components/app-bar-connected';
import HomePage from '@src/containers/home-page';
import IntroPage from '@src/containers/intro-page';
import MenuPage from '@src/containers/menu-page';
import NotFoundPage from "@src/containers/notfound-page";
import VideoListPage from "@src/containers/video-list-page";


class App extends React.Component<{}, {}> {

    public render(): React.ReactElement<App> {
        return (
            <ConnectedRouter history={history}>
                <div className="page-container">
                    <header>
                        <AppBarConnected title="MTFS" />
                    </header>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" component={HomePage}/>
                            <Route exact={true} path="/intro" component={IntroPage}/>
                            <Route exact={true} path="/menu" component={MenuPage}/>
                            <Route exact={true} path="/video-list" component={VideoListPage}/>
                            <Route component={NotFoundPage}/>
                        </Switch>
                    </main>
                </div>
            </ConnectedRouter>
        );
    }
}

export default hot(module)(App);
