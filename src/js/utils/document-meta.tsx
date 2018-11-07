import React from 'react';

type DocumentMetaProps = {
    title?: string;
    children?: JSX.Element;
};

type DocumentMetaState = {};

class DocumentMeta extends React.PureComponent<DocumentMetaProps, DocumentMetaState> {
    constructor(props: DocumentMetaProps) {
        super(props);
    }

    static updateDocumentMeta(props: DocumentMetaProps): void {
        const { title } = props;
        if (title && document && 'title' in document) {
            document.title = title;
        }
    }

    componentDidMount() {
        DocumentMeta.updateDocumentMeta(this.props);
    }

    componentDidUpdate() {
        DocumentMeta.updateDocumentMeta(this.props);
    }

    render() {
        const { children } = this.props;
        return children || null;
    }
}

export default DocumentMeta;
