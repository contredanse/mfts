/**
 * Temp debug menu
 */
import React from 'react';

import { connect } from 'react-redux';
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
} from '@material-ui/core';

import { Menu as MenuIcon } from '@material-ui/icons';

import { RootState } from '@src/redux/index';

type MenuLinkProps = {
    path: string;
    label: string;
    active: boolean;
};

type AppBarProps = {
    title: string;
    // menuLinks: MenuLinkProps[];
};

export type AppBarWithStylesProps = AppBarProps & WithStyles<ComponentClassNames>;
export type AppBarWithRouterProps = AppBarProps & RouteComponentProps<{}>;

export const AppBarComponent: React.SFC<AppBarWithStylesProps & AppBarWithRouterProps> = props => {
    const { classes, history } = props;
    const currentPath = props.location.pathname;

    const menuItems: MenuLinkProps[] = [
        { path: '/', label: 'Home', active: false },
        { path: '/page-list', label: 'Pages', active: false },
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
                            history.push('/menu');
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="title" color="inherit" className={classes.flex}>
                        {props.title}
                    </Typography>
                    {menuItems.map(({ path, label, active }) => {
                        return <LinkItem key={path} path={path} label={label} active={active} />;
                    })}
                </Toolbar>
            </MaterialAppBar>
        </div>
    );
};

/**
 * Exporting AppBarWithStyles component
 */

type ComponentClassNames = 'root' | 'flex' | 'menuButton';

const decorate = withStyles(({ palette, spacing }) => ({
    root: {
        width: '100%',
        //padding: spacing.unit,
        //color: palette.primary.main,
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
}));

const AppBarWithStyles = decorate<AppBarWithRouterProps>(AppBarComponent);

/**
 * Exporting AppBar with router support and injected styles
 */
const mapStateToProps = (state: RootState) => ({});

const mapDispatchToProps = (dispatch: any) => ({});

export const AppBar = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AppBarWithStyles)
);
