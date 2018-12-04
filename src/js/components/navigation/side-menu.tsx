import React from 'react';
import { State as MenuState } from 'react-burger-menu';
import { RouteComponentProps, withRouter } from 'react-router';

import './side-menu.scss';

import contredanseLogo from '@assets/images/logo-contredanse.png';
import ConnectedLangSelector from '@src/components/lang-selector';
import ConnectedLoginMenu from '@src/components/navigation/login-menu';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as uiActions from '@src/store/ui/actions';
import { getMainMenuRoute, isScreenAdaptedForHelixMenu } from '@src/helpers/main-menu-redirect';

// To not bundle svg
const Menu = require('react-burger-menu/lib/menus/pushRotate');

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
        hidden: !isScreenAdaptedForHelixMenu(),
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

/*
const menuRoutes = {
    home: (lang: string) => history.push(`/`),
    helix: (lang: string) => history.push(`/${lang}/menu`),
    'page-list': (lang: string) => history.push(`/${lang}/page-list`),
    about: (lang: string) => history.push(`/${lang}/about`),
}*/

export class SideMenu extends React.PureComponent<Props, State> {
    static defaultProps = defaultProps;

    constructor(props: Props) {
        super(props);
    }

    initRoutes(lang: string) {}

    render() {
        const { isOpen, onStateChange } = this.props;

        const { lang } = this.props;

        return (
            <Menu
                width={300}
                isOpen={isOpen}
                onStateChange={onStateChange}
                pageWrapId={'page-wrap'}
                outerContainerId={'outer-container'}
            >
                {Object.entries(menuItems).map(([key, menuItem]) => {
                    if ('hidden' in menuItem && menuItem.hidden === true) {
                        return null;
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
                    handleLoginRequest={() => {
                        this.props.history.push(`/${lang}/login`);
                        if (this.props.onStateChange) {
                            this.props.onStateChange({ isOpen: false });
                        }
                    }}
                />

                <ConnectedLangSelector>
                    {({ nextLang, updateLang, currentLang }) => (
                        <>
                            <button color="inherit">{currentLang}</button>

                            <button color="inherit" onClick={() => updateLang(nextLang)}>
                                {nextLang}
                            </button>
                        </>
                    )}
                </ConnectedLangSelector>

                <img src={contredanseLogo} />
            </Menu>
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
