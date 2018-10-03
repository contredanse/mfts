import React from 'react';
import Page from '@src/components/page';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import PageProxy from '@src/models/proxy/page-proxy';
import { PageOverlay } from '@src/components/layout/page-overlay';
import PageRepository from '@src/models/repository/page-repository';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/shared/document-meta';

type IntroContainerProps = {
    lang: DataSupportedLangType;
    pageRepository: PageRepository;
    introPageId?: string;
} & RouteComponentProps<any>;

type IntroContainerState = {
    introPage?: PageProxy;
};

const defaultState = {};

class IntroContainer extends React.PureComponent<IntroContainerProps, IntroContainerState> {
    static defaultProps = {
        introPageId: 'forms.introduction',
    };

    readonly state: IntroContainerState;

    constructor(props: IntroContainerProps) {
        super(props);
        this.state = defaultState;
    }

    componentDidMount() {
        const pageId = this.props.introPageId!;
        this.setState({
            introPage: this.props.pageRepository.getPageProxy(pageId),
        });
    }

    navigatePageList = () => {
        const { history, lang } = this.props;
        history.push(`/${lang}/page-list`);
    };

    render() {
        const { introPage } = this.state;

        const { lang, introPageId } = this.props;

        return (
            <PageOverlay closeButton={false}>
                <div className="page-wrapper">
                    <DocumentMeta title={'MFTS >> Introduction'} />
                    {introPage ? (
                        <>
                            <Page
                                pageProxy={introPage}
                                lang={lang}
                                onPagePlayed={() => {
                                    this.navigatePageList();
                                }}
                            />
                            {/*
                            <div style={{position: 'absolute', bottom: '70px', right:'15px', border: '1px solid white'}}>
                                Skip intro >>
                            </div>
                            */}
                        </>
                    ) : (
                        <div>
                            {/* Only dev */}
                            Error page: {introPageId || 'undefined'} cannot be found.
                        </div>
                    )}
                </div>
            </PageOverlay>
        );
    }
}

export default withRouter(IntroContainer);
