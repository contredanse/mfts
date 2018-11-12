import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import AppAssetsLocator from '@src/core/app-assets-locator';
import About from '@src/components/about';
import DocumentMeta from '@src/utils/document-meta';
import NotFoundContainer from '@src/containers/notfound-container';

import { HTMLStaticContent, staticContent } from '@data/markdown';

type AboutContainerProps = {
    assetsLocator: AppAssetsLocator;
    lang: string;
    section: string;
    documents?: HTMLStaticContent[];
} & RouteComponentProps<{}>;

type AboutContainerState = {
    document?: HTMLStaticContent;
};

const defaultProps = {
    documents: staticContent,
};

class AboutContainer extends React.Component<AboutContainerProps, AboutContainerState> {
    static defaultProps = defaultProps;

    constructor(props: AboutContainerProps) {
        super(props);
        this.state = this.getStateFromSection(props.section, props.lang);
    }

    getStateFromSection(sectionId: string, lang: string): AboutContainerState {
        const doc =
            this.props.documents!.find((element: HTMLStaticContent) => {
                return sectionId === element.section_id;
            }) || undefined;
        return {
            document: doc,
        };
    }

    render() {
        const { lang, assetsLocator } = this.props;
        const { document } = this.state;

        if (document) {
            const title = document.title[lang] || document.title.en;
            const content = document.content[lang] || document.content.en;
            const documentTitle = `MFS >> ${title}`;

            return (
                <div className="full-page-slide-ctn">
                    <DocumentMeta title={documentTitle} />
                    <About assetsLocator={assetsLocator} lang={lang} content={content} />
                </div>
            );
        } else {
            return <NotFoundContainer />;
        }
    }
}

export default withRouter(AboutContainer);
