import React from 'react';
import Page from '@src/components/page';
import NotFoundContainer from '@src/containers/notfound-container';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageEntity from '@src/models/entity/page-entity';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import MenuRepository, { PrevAndNextPageEntity, PrevAndNextPageId } from '@src/models/repository/menu-repository';
import { RouteComponentProps, withRouter } from 'react-router';

type PageContainerProps = {
    pageId: string;
    lang: DataSupportedLangType;
    pageRepository: PageRepository;
    menuRepository?: MenuRepository;
} & RouteComponentProps<any>;

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
            const pageEntity = await this.props.pageRepository.getPageEntity(this.props.pageId);
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

    getPrevAndNextPageEntities(pageId: string): PrevAndNextPageEntity {
        const { menuRepository } = this.props;
        if (menuRepository === undefined) {
            return {};
        }

        return menuRepository.getPrevAndNextPageEntityMenu(pageId, this.props.lang, this.props.pageRepository);
    }

    render() {
        const { pageExists, pageEntity } = this.state;
        // should not be required, exit if async loading
        // of pageData is not yet present (see componentDidMount())
        if (pageExists === undefined) {
            return null;
        }

        const { previous, next } = this.getPrevAndNextPageEntities(this.props.pageId);

        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    {pageEntity ? (
                        <Page pageEntity={pageEntity} lang={this.props.lang} {...previous} {...next} />
                    ) : (
                        <NotFoundContainer />
                    )}
                </div>
            </PageOverlay>
        );
    }
}

export default withRouter(PageContainer);
