import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import DataProxy, { PageEntity, SupportedLangType } from '@src/repositories/data-proxy';

interface IProps {
    pageId: string;
    lang: SupportedLangType;
    dataProxy: DataProxy;
}
interface IState {
    pageExists: boolean | undefined;
    pageEntity: PageEntity | undefined;
}

class PageContainer extends React.Component<IProps, IState> {
    readonly state = {
        pageExists: undefined,
        pageEntity: undefined,
    };

    constructor(props: IProps) {
        super(props);
    }

    async componentDidMount() {
        try {
            const pageEntity = await this.props.dataProxy.getPageEntity(this.props.pageId, this.props.lang);
            this.setState((prevState: IState): IState => {
                return {
                    ...prevState,
                    pageExists: true,
                    pageEntity: pageEntity,
                };
            });
        } catch (e) {
            this.setState((prevState: IState): IState => {
                return {
                    ...prevState,
                    pageExists: false,
                    pageEntity: undefined,
                };
            });
        }
    }

    render() {
        const { pageExists, pageEntity } = this.state;
        // should not be required, exit if async loading
        // of pageData is not yet present (see componentDidMount())
        if (pageExists === undefined) {
            return null;
        }
        return <div>{pageEntity ? <Page pageEntity={pageEntity} /> : <NotFoundContainer />}</div>;
    }
}

export default PageContainer;
