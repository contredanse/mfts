import React from 'react';
import './page-breadcrumb.scss';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';

export type PageBreadcrumbProps = {
    lang: string;
    title: string;
    sections?: MenuSectionProps[];
    onSectionSelected?: (menuId: string) => {};
} & RouteComponentProps<any>;

type PageBreadcrumbState = {};

const defaultProps = {};

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
            const { history, lang } = this.props;
            history.push(`/${lang}/page-list/${menuId}`);
        }
    };
    render() {
        const { sections, title, onSectionSelected } = this.props;
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
                            <span className="page-breadcrumb__crumb page-breadcrumb__separator">/</span>
                        </React.Fragment>
                    ))}
                <span className=" page-breadcrumb__crumb--current">{title}</span>
            </div>
        );
    }
}

export default withRouter(PageBreadcrumb);
