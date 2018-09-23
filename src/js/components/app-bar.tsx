/**
 * Temp debug menu
 */
import React from 'react';

import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

import {
    AppBar as MaterialAppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    withStyles,
    WithStyles,
    Theme,
    createStyles,
} from '@material-ui/core';

import { Menu as MenuIcon } from '@material-ui/icons';
import ConnectedLangSelector from '@src/components/lang-selector';

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
            marginLeft: -12,
            marginRight: 20,
        },
    });

export type AppBarWithStylesProps = AppBarProps & WithStyles<typeof styles>;
export type AppBarWithRouterProps = AppBarProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppBarWithStylesProps & AppBarWithRouterProps> = props => {
    const { classes, history, lang } = props;
    const currentPath = props.location.pathname;

    const menuItems: MenuLinkProps[] = [
        { path: '/', label: 'Home', active: false },
        { path: `/${lang}/page-list`, label: 'Pages', active: false },
        { path: `/${lang}/login`, label: 'Login', active: false },
    ].map((menuLinkProps: MenuLinkProps) => {
        return { ...menuLinkProps, active: currentPath === menuLinkProps.path };
    });

    const LinkItem = (linkProps: MenuLinkProps) => {
        return (
            <Button
                color="inherit"
                variant={linkProps.active ? 'raised' : undefined}
                component={(btnProps: any) => <Link to={linkProps.path} {...btnProps} />}
            >
                {linkProps.label}
            </Button>
        );
    };

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
                    <ConnectedLangSelector />
                    {menuItems.map(({ path, label, active }) => {
                        return <LinkItem key={path} path={path} label={label} active={active} />;
                    })}
                </Toolbar>
            </MaterialAppBar>
        </div>
    );
};

export const AppBar = withStyles(styles)(withRouter(AppBarComponent));
