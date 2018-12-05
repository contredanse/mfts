import React from 'react';
import './welcome.scss';
import { RouteComponentProps, withRouter } from 'react-router';
import contredanseLogo from '@assets/images/logo-contredanse.png';
import PageRepository from '@src/models/repository/page-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import PageCard from '@src/components/page-card';
import AppBarPortal from '@src/components/navigation/app-bar-portal';
import ConnectedLoginForm from '@src/components/login-form';
import { getMainMenuRoute } from '@src/helpers/main-menu-redirect';

type WelcomeProps = {
    lang?: string;
    pageRepository: PageRepository;
    fromPageId?: string;
    handleLoginSuccess?: () => void;
} & RouteComponentProps;

type WelcomeState = {
    currentPage?: PageProxy | null;
    mounted: boolean;
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
            mounted: false,
        };
    }

    async componentDidMount() {
        const { fromPageId, pageRepository } = this.props;
        if (fromPageId) {
            this.setState({
                currentPage: pageRepository.getPageProxy(fromPageId),
            });
        }

        // wait a bit for browser stuff
        const ANIMATION_TIMEOUT = 80;
        setTimeout(() => {
            this.setState({ mounted: true });
        }, ANIMATION_TIMEOUT);
    }

    render() {
        const { lang, handleLoginSuccess } = this.props;
        const { currentPage, mounted } = this.state;
        const title = lang === 'fr' ? 'Bienvenue' : 'Welcome';

        // For nimations
        const initialCls = mounted ? 'animation-end' : '';

        return (
            <>
                <AppBarPortal>
                    <div>{title}</div>
                </AppBarPortal>
                <div className="welcome-container">
                    <div className={`welcome-container-inner animation-start ${initialCls}`}>
                        <ConnectedLoginForm
                            lang={lang}
                            match={this.props.match}
                            history={this.props.history}
                            onSuccess={handleLoginSuccess}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(Welcome);
