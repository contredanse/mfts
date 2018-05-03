import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType, IDataRepository } from '@src/model/data-repository';
import PageEntity from '@src/model/page-entity';

interface IProps {
    pageId: string;
    lang: DataSupportedLangType;
    dataRepository: IDataRepository;
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
            const pageEntity = await this.props.dataRepository.getPageEntity(this.props.pageId, this.props.lang);
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
        return (
            <div>{pageEntity ? <Page pageEntity={pageEntity} lang={this.props.lang} /> : <NotFoundContainer />}</div>
        );
    }
}

export default PageContainer;
