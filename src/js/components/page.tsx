import * as React from 'react';
import './page.scss';
import { IDataPage } from '@data/data-pages';
import {PageOverlay} from '@src/components/page-overlay';

interface IProps {
    pageData: IDataPage;
}

interface IState {}

export default class Page extends React.Component<IProps, IState> {
    render() {
        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">Page {this.props.pageData.id}</div>
            </PageOverlay>
        )
    }
}
