import * as React from 'react';
import './page.scss';
import { IDataPage } from '@data/data-pages';

interface IProps {
    page: IDataPage;
}

interface IState {}

export default class Page extends React.Component<IProps, IState> {
    render() {
        return <div className="page-wrapper">Page</div>;
    }
}
