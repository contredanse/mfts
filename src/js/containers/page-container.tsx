import React from 'react';
import Page from '@src/components/page';
import { IDataPage } from '@data/data-pages';

interface IProps {
    pageId: string;
}
interface IState {}

class PageContainer extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (<Page pageId={this.props.pageId}/>);

    }
}

export default PageContainer;
