import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import DocumentMeta from '@src/utils/document-meta';
import { PageOverlay } from '@src/components/layout/page-overlay';
import NotFound from '@src/components/not-found';

type NotFoundContainerProps = {} & RouteComponentProps<any>;
type NotFoundContainerState = {};

class NotFoundContainer extends React.Component<NotFoundContainerProps, NotFoundContainerState> {
    constructor(props: NotFoundContainerProps) {
        super(props);
    }

    render() {
        return (
            <PageOverlay closeButton={false}>
                <DocumentMeta title="404 - Not found" />
                <NotFound />
            </PageOverlay>
        );
    }
}

export default withRouter(NotFoundContainer);
