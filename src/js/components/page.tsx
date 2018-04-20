import * as React from 'react';
import './page.scss';
import { IDataPage } from '@data/data-pages';
import { PageOverlay } from '@src/components/page-overlay';

interface IProps {
    pageData: IDataPage;
}

interface IState {}

export default class Page extends React.Component<IProps, IState> {
    componentDidMount() {}

    render() {
        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <div className="page-container">
                        <div className="page-header">The header</div>
                        <div className="page-content">Page {this.props.pageData.id}</div>
                        <div className="page-footer">The footer</div>
                    </div>
                </div>
            </PageOverlay>
        );
    }
}
