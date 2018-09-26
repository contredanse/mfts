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
} from '@material-ui/core';

import {
    Menu as MenuIcon,
    AccountBoxRounded as AccountBoxIcon,
    InfoRounded as InfoIcon,
    ListRounded as ListIcon,
    HomeRounded as HomeIcon,
} from '@material-ui/icons';

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
                            history.push(`/${lang}/menu`);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="title" color="inherit" className={classes.flex}>
                        {props.title}
                    </Typography>

                    <IconButton
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="Home"
                        onClick={() => {
                            history.push(`/`);
                        }}
                    >
                        <HomeIcon />
                    </IconButton>

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
