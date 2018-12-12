import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

type NotFoundContainerProps = {} & RouteComponentProps<any>;
type NotFoundContainerState = {};

export const NotFoundComponent: React.FC<{}> = props => {
    return <h1 style={{ color: 'red' }}>Page not found!</h1>;
};

class NotFoundContainer extends React.Component<NotFoundContainerProps, NotFoundContainerState> {
    constructor(props: NotFoundContainerProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <NotFoundComponent />
            </div>
        );
    }
}

export default withRouter(NotFoundContainer);
