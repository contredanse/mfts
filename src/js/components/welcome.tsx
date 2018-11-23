import React from 'react';
import './welcome.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import contredanseLogo from '@assets/images/logo-contredanse.png';
import PageRepository from '@src/models/repository/page-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import PageCard from '@src/components/page-card';
import AppBarPortal from '@src/components/navigation/app-bar-portal';

type WelcomeProps = {
    lang?: string;
    pageRepository: PageRepository;
    fromPageId?: string;
} & RouteComponentProps;

type WelcomeState = {
    currentPage?: PageProxy | null;
};

const defaultProps = {
    lang: 'en',
};

class Welcome extends React.PureComponent<WelcomeProps, WelcomeState> {
    static defaultProps = defaultProps;

    constructor(props: WelcomeProps) {
        super(props);
        this.state = {
            currentPage: null,
        };
    }

    componentDidMount(): void {
        const { fromPageId, pageRepository } = this.props;
        if (fromPageId) {
            this.setState({
                currentPage: pageRepository.getPageProxy(fromPageId),
            });
        }
    }

    render() {
        const { lang } = this.props;
        const { currentPage } = this.state;
        const title = lang === 'fr' ? 'Bienvenue' : 'Welcome';
        return (
            <div className="welcome-container">
                <AppBarPortal>
                    <div>{title}</div>
                </AppBarPortal>
                This page is restricted to our beloved registered users.
                {currentPage && (
                    <div className="current-page-container">
                        <PageCard pageProxy={currentPage} lang={lang} />
                    </div>
                )}
                Trial ?
                <img src={contredanseLogo} alt="Contredanse logo" />
            </div>
        );
    }
}

export default withRouter(Welcome);
