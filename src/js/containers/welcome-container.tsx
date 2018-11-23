import React from 'react';
import Page from '@src/components/page';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/utils/document-meta';
import Welcome from '@src/components/welcome';
import PageCard from '@src/components/page-card';

type RestrictedContainerProps = {
    lang?: DataSupportedLangType;
    pageRepository: PageRepository;
    fromPageId?: string;
} & RouteComponentProps<any>;

type RestrictedContainerState = {};

const defaultState = {};

const defaultProps = {
    lang: 'en',
};

class WelcomeContainer extends React.PureComponent<RestrictedContainerProps, RestrictedContainerState> {
    static defaultProps = defaultProps;

    readonly state: RestrictedContainerState;

    constructor(props: RestrictedContainerProps) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {}

    render() {
        const { lang, pageRepository, fromPageId } = this.props;
        return (
            <PageOverlay closeButton={false}>
                <DocumentMeta title={'MFS >> Welcome'} />
                <Welcome pageRepository={pageRepository} lang={lang} fromPageId={fromPageId} />
            </PageOverlay>
        );
    }
}

export default withRouter(WelcomeContainer);
