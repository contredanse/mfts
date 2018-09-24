import React from 'react';
import './page-breadcrumb.scss';
import { MenuSectionProps } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';

type PageBreadcrumbProps = {
    title: string;
    sections?: MenuSectionProps[];
    onSectionSelected?: (menuId: string) => {};
};

type PageBreadcrumbState = {};

const defaultProps = {} as PageBreadcrumbProps;

class PageBreadcrumb extends React.PureComponent<PageBreadcrumbProps, PageBreadcrumbState> {
    static readonly defaultProps: PageBreadcrumbProps = defaultProps;

    constructor(props: PageBreadcrumbProps) {
        super(props);
    }

    render() {
        const { sections, title, onSectionSelected } = this.props;
        return (
            <ul className="page-breadcrumb">
                {Array.isArray(sections) &&
                    sections.map(menu => (
                        <li key={menu.id}>
                            <a
                                ref={menu.id}
                                {...(onSectionSelected
                                    ? {
                                          onClick: () => {
                                              onSectionSelected(menu.id);
                                          },
                                      }
                                    : {})}
                            >
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

export default PageBreadcrumb;
