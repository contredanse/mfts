import React from 'react';
import './page-breadcrumb.scss';
import { MenuSectionProps } from '@src/models/repository/menu-repository';

type PageBreadcrumbProps = {
    title: string;
    sections?: MenuSectionProps[];
};

type PageBreadcrumbState = {};

class PageBreadcrumb extends React.PureComponent<PageBreadcrumbProps, PageBreadcrumbState> {
    constructor(props: PageBreadcrumbProps) {
        super(props);
    }

    render() {
        const { sections, title } = this.props;
        return (
            <ul className="page-breadcrumb">
                {Array.isArray(sections) &&
                    sections.map(item => (
                        <li key={item.id}>
                            <a ref={item.id} href={item.id}>
                                {item.title}
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
