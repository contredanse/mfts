import React from 'react';
import './page-breadcrumb.scss';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';

type PageBreadcrumbProps = {
    lang: string;
    title: string;
    sections?: MenuSectionProps[];
    onSectionSelected?: (menuId: string) => {};
} & RouteComponentProps<any>;

type PageBreadcrumbState = {};

const defaultProps = {} as PageBreadcrumbProps;

class PageBreadcrumb extends React.PureComponent<PageBreadcrumbProps, PageBreadcrumbState> {
    static readonly defaultProps: PageBreadcrumbProps = defaultProps;

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
            <ul className="page-breadcrumb">
                {Array.isArray(sections) &&
                    sections.map(menu => (
                        <li key={menu.id}>
                            <a ref={menu.id} onClick={() => this.handleSectionSelected(menu.id)}>
                                {menu.title}
                            </a>
                            &gt;&gt;
                        </li>
                    ))}
                <li>
                    <a className="title">{title}</a>
                </li>
            </ul>
        );
    }
}

export default withRouter(PageBreadcrumb);
