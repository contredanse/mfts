import React from 'react';
import {hot} from 'react-hot-loader';
import {ConnectedRouter} from 'react-router-redux';
import {Route} from 'react-router-dom';
import { history } from '@src/store';

import {Switch} from 'react-router';
import { AppBarConnected } from '@src/components/app-bar-connected';
import HomePage from "@src/containers/home-page";
import IntroPage from "@src/containers/intro-page";
import MenuPage from "@src/containers/menu-page";



class NotFoundComponent extends React.Component<{}, {}> {
    public render() {
        return(
            <h1 style={{color: 'red'}}>Page not found!</h1>
        );
    }
}

class App extends React.Component<{}, {}> {

    public render(): React.ReactElement<App> {
        return (
            <ConnectedRouter history={history}>
                <div className="page-container">
                    <header>
                        <AppBarConnected title="MFTS" />
                    </header>
                    <main>
                        <Switch>
                            <Route exact={true} path="/" component={HomePage}/>
                            <Route exact={true} path="/intro" component={IntroPage}/>
                            <Route exact={true} path="/menu" component={MenuPage}/>
                            <Route component={NotFoundComponent}/>
                        </Switch>
                    </main>
                </div>
            </ConnectedRouter>
        );
    }
}

export default hot(module)(App);
