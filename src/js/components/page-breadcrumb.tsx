import React from 'react';
import './page-breadcrumb.scss';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import { getMainMenuRoute } from '@src/helpers/main-menu-redirect';

export type PageBreadcrumbProps = {
    lang: string;
    title: string;
    sections?: MenuSectionProps[];
    separator?: string;
    onSectionSelected?: (menuId: string) => {};
    useMainMenuRoute?: boolean;
} & RouteComponentProps<any>;

type PageBreadcrumbState = {};

const defaultProps = {
    separator: '/',
    useMainMenuRoute: true,
};

class PageBreadcrumb extends React.PureComponent<PageBreadcrumbProps, PageBreadcrumbState> {
    static defaultProps = defaultProps;

    constructor(props: PageBreadcrumbProps) {
        super(props);
    }

    handleSectionSelected = (menuId: string) => {
        const { onSectionSelected } = this.props;
        if (onSectionSelected !== undefined) {
            onSectionSelected(menuId);
        } else {
            const { history, lang, useMainMenuRoute } = this.props;
            if (useMainMenuRoute) {
                history.push(getMainMenuRoute(lang, menuId));
            } else {
                history.push(`/${lang}/page-list/${menuId}`);
            }
        }
    };
    render() {
        const { sections, title, separator } = this.props;
        return (
            <div className="page-breadcrumb">
                {Array.isArray(sections) &&
                    sections.map(menu => (
                        <React.Fragment key={menu.id}>
                            <a
                                className="page-breadcrumb__crumb page-breadcrumb__link"
                                title={menu.title}
                                onClick={() => this.handleSectionSelected(menu.id)}
                            >
                                <span>{menu.title}</span>
                            </a>
                            <span className="page-breadcrumb__crumb page-breadcrumb__separator">{separator}</span>
                        </React.Fragment>
                    ))}
                <span className=" page-breadcrumb__crumb--current">{title}</span>
            </div>
        );
    }
}

export default withRouter(PageBreadcrumb);
