import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import About from '@src/components/about';
import DocumentMeta from '@src/utils/document-meta';
import NotFoundContainer from '@src/containers/notfound-container';

import { HTMLStaticContent, staticContent } from '@data/markdown';
import { PageOverlay } from '@src/components/layout/page-overlay';

type AboutContainerProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    section: string;
    documents?: HTMLStaticContent[];
} & RouteComponentProps<{}>;

type AboutContainerState = {};

const defaultProps = {
    documents: staticContent,
};

class AboutContainer extends React.PureComponent<AboutContainerProps, AboutContainerState> {
    static defaultProps = defaultProps;

    constructor(props: AboutContainerProps) {
        super(props);
    }

    render() {
        const { lang, assetsLocator, section } = this.props;
        const document = this.loadDocumentFromSection(section, lang);
        if (document) {
            const title = document.title[lang] || document.title.en;
            const content = document.content[lang] || document.content.en;
            const documentTitle = `MFS >> ${title}`;
            return (
                <PageOverlay closeButton={false}>
                    <DocumentMeta title={documentTitle} />
                    <About assetsLocator={assetsLocator} lang={lang} content={content} title={title} />
                </PageOverlay>
            );
        } else {
            return <NotFoundContainer />;
        }
    }

    loadDocumentFromSection(sectionId: string, lang: string): HTMLStaticContent | null {
        return (
            this.props.documents!.find((element: HTMLStaticContent) => {
                return sectionId === element.section_id;
            }) || null
        );
    }
}

export default withRouter(AboutContainer);
