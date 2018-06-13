import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType, IDataRepository } from '@src/models/repository/data-repository';
import PageEntity from '@src/models/entity/page-entity';
import { PageOverlay } from '@src/components/layout/page-overlay';

type PageContainerProps = {
    pageId: string;
    lang: DataSupportedLangType;
    dataRepository: IDataRepository;
};
type PageContainerState = {
    pageExists: boolean | undefined;
    pageEntity: PageEntity | undefined;
};

class PageContainer extends React.Component<PageContainerProps, PageContainerState> {
    readonly state = {
        pageExists: undefined,
        pageEntity: undefined,
    };

    constructor(props: PageContainerProps) {
        super(props);
    }

    async componentDidMount() {
        try {
            const pageEntity = await this.props.dataRepository.getPageEntity(this.props.pageId);
            this.setState(
                (prevState: PageContainerState): PageContainerState => {
                    return {
                        ...prevState,
                        pageExists: true,
                        pageEntity: pageEntity,
                    };
                }
            );
        } catch (e) {
            this.setState(
                (prevState: PageContainerState): PageContainerState => {
                    return {
                        ...prevState,
                        pageExists: false,
                        pageEntity: undefined,
                    };
                }
            );
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
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    {pageEntity ? <Page pageEntity={pageEntity} lang={this.props.lang} /> : <NotFoundContainer />}
                </div>
            </PageOverlay>
        );
    }
}

export default PageContainer;
