import React from 'react';
import { State as MenuState } from 'react-burger-menu';
import { RouteComponentProps, withRouter } from 'react-router';

import './side-menu.scss';

import contredanseLogo from '@assets/images/logo-contredanse-white.jpg';
import ConnectedLangSelector from '@src/components/lang-selector';
import ConnectedLoginMenu from '@src/components/navigation/login-menu';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as uiActions from '@src/store/ui/actions';
import { getMainMenuRoute, isScreenAdaptedForHelixMenu } from '@src/helpers/main-menu-redirect';

// To not bundle svg
//const Menu = require('react-burger-menu/lib/menus/pushRotate');
//const Menu = require('react-burger-menu/lib/menus/push');
const Menu = require('react-burger-menu/lib/menus/slide');
// import { pushRotate as Menu } from 'react-burger-menu'

type Props = {
    isOpen: boolean;
    onStateChange?: (state: MenuState) => void;
    lang: string;
} & RouteComponentProps<any>;

type State = {};

const defaultProps = {
    isOpen: false,
};

const menuItems = {
    home: {
        label: { fr: 'Accueil', en: 'Home' },
        route: '/',
    },
    menu: {
        label: { fr: 'Menu', en: 'Menu' },
        route: getMainMenuRoute,
        hidden: (): boolean => {
            return !isScreenAdaptedForHelixMenu();
        },
    },
    list: {
        label: { fr: 'Recherche', en: 'Search' },
        route: '/{lang}/page-list',
    },
    about: {
        label: { fr: 'A propos', en: 'About' },
        route: '/{lang}/about/about',
    },
    bio: {
        label: { fr: 'Biographie', en: 'Biography' },
        route: '/{lang}/about/bio',
    },
    biblio: {
        label: { fr: 'Bibliographie', en: 'Bibliography' },
        route: '/{lang}/about/biblio',
    },
    credits: {
        label: { fr: 'Crédits', en: 'Credits' },
        route: '/{lang}/about/credits',
    },
};

const menuStyles = {
    /*
    bmBurgerButton: {
        position: 'fixed',
        width: '36px',
        height: '30px',
        left: '36px',
        top: '36px'
    },
    bmBurgerBars: {
        background: '#373a47'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: '#373a47',
        padding: '2.5em 1.5em 0',
        fontSize: '1.15em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em'
    },
    bmItem: {
        display: 'inline-block'
    },*/
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.82)',
        //zIndex: 10000,
    },
};

export class SideMenu extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);
    }

    initRoutes(lang: string) {}

    render() {
        const { isOpen, onStateChange } = this.props;

        const { lang } = this.props;

        const footerClass = isOpen ? 'side-menu-footer open' : 'side-menu-footer closed';
        const headerClass = isOpen ? 'side-menu-header open' : 'side-menu-header closed';

        return (
            <>
                <div className={headerClass}>
                    <div className="side-menu-header-inner">
                        <div className="side-menu-header-left">
                            <h2>Material for the spine</h2>
                        </div>
                        <div className="side-menu-header-right">
                            <ConnectedLangSelector>
                                {({ currentLang, nextLang, toggleLang, updateLang }) => (
                                    <div className="lang-selector-panel" onClick={() => updateLang(nextLang)}>
                                        {nextLang === 'en' ? 'English' : 'Français'}
                                    </div>
                                )}
                            </ConnectedLangSelector>
                        </div>
                    </div>
                </div>

                <div className={footerClass}>
                    <div className="side-menu-footer-center">
                        <div className="footer-logo-container">
                            <div>
                                <img src={contredanseLogo} />
                            </div>
                            <div>© Contredanse Editions, 2018</div>
                        </div>
                    </div>

                    <div className="side-menu-footer-right" />
                </div>

                <Menu
                    styles={menuStyles}
                    width={'210px'}
                    isOpen={isOpen}
                    onStateChange={onStateChange}
                    pageWrapId={'page-wrap'}
                    outerContainerId={'outer-container'}
                >
                    {Object.entries(menuItems).map(([key, menuItem]) => {
                        if ('hidden' in menuItem) {
                            const hidden = typeof menuItem.hidden === 'function' ? menuItem.hidden() : menuItem.hidden;
                            if (hidden) {
                                return null;
                            }
                        }

                        const label = lang === 'fr' ? menuItem.label.fr : menuItem.label.en;
                        return (
                            <a
                                className={`side-menu-item key-${key}`}
                                key={key}
                                onClick={() => {
                                    const newRoute =
                                        typeof menuItem.route === 'function'
                                            ? menuItem.route(lang)
                                            : menuItem.route.replace('{lang}', lang);

                                    this.props.history.push(newRoute);
                                    if (this.props.onStateChange) {
                                        this.props.onStateChange({ isOpen: false });
                                    }
                                }}
                            >
                                {label}
                            </a>
                        );
                    })}

                    <ConnectedLoginMenu
                        lang={lang}
                        afterLogout={() => {
                            this.props.history.push(`/`);
                            if (this.props.onStateChange) {
                                this.props.onStateChange({ isOpen: false });
                            }
                        }}
                        handleLoginRequest={() => {
                            this.props.history.push(`/${lang}/login`);
                            if (this.props.onStateChange) {
                                this.props.onStateChange({ isOpen: false });
                            }
                        }}
                    />
                </Menu>
            </>
        );
    }
}

export default withRouter(SideMenu);

const mapStateToProps = ({ ui }: ApplicationState) => ({
    isOpen: ui.isMenuOpen,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onStateChange: (state: MenuState) => dispatch(uiActions.setIsMenuOpen(state.isOpen)),
});

export const ConnectedSideMenu = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(SideMenu)
);
