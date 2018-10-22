/**
 * Temp debug menu
 */
import React from 'react';

import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';

import {
    AppBar as MaterialAppBar,
    Toolbar,
    Typography,
    IconButton,
    withStyles,
    WithStyles,
    Theme,
    createStyles,
    Button,
} from '@material-ui/core';

import {
    Menu as MenuIcon,
    AccountBoxRounded as AccountBoxIcon,
    InfoRounded as InfoIcon,
    ListRounded as ListIcon,
} from '@material-ui/icons';
import ConnectedLangSelector from '@src/components/lang-selector';

import helixSvg from '@assets/svg/helix-contredanse.svg';
import ConnectedNavProvider from '@src/components/navigation/nav-provider';

type MenuLinkProps = {
    path: string;
    label: string;
    active: boolean;
};

type AppBarProps = {
    title: string;
    lang: string;
    // menuLinks: MenuLinkProps[];
};

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        flex: {
            flex: 1,
        },
        menuButton: {
            marginLeft: -5,
            marginRight: 0,
        },
    });

export type AppBarWithStylesProps = AppBarProps & WithStyles<typeof styles>;
export type AppBarWithRouterProps = AppBarProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppBarWithStylesProps & AppBarWithRouterProps> = props => {
    const { classes, history, lang } = props;
    //const currentPath = props.location.pathname;

    return (
        <div className={classes.root}>
            <MaterialAppBar elevation={0} position="fixed" style={{ backgroundColor: 'transparent' }}>
                <Toolbar>
                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => {
                            history.push(`/`);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Menu"
                        onClick={() => {
                            history.push(`/${lang}/menu`);
                        }}
                    >
                        <img src={helixSvg} style={{ fill: 'white' }} />
                        {/* <DnaIcon size={18} /> */}
                    </IconButton>

                    <div id="app-bar-portal-ctn" />

                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="List"
                        onClick={() => {
                            history.push(`/${lang}/page-list`);
                        }}
                    >
                        <ListIcon />
                    </IconButton>

                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Info"
                        onClick={() => {
                            history.push(`/${lang}/about`);
                        }}
                    >
                        <InfoIcon />
                    </IconButton>

                    <ConnectedLangSelector>
                        {({ nextLang, updateLang }) => (
                            <Button color="inherit" onClick={() => updateLang(nextLang)}>
                                {nextLang}
                            </Button>
                        )}
                    </ConnectedLangSelector>

                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Profile"
                        onClick={() => {
                            history.push(`/${lang}/login`);
                        }}
                    >
                        <AccountBoxIcon />
                    </IconButton>
                </Toolbar>
            </MaterialAppBar>
        </div>
    );
};

export const AppBar = withStyles(styles)(withRouter(AppBarComponent));
