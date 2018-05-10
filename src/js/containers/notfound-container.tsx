import React from 'react';

type NotFoundContainerProps = {};
type NotFoundContainerState = {};

export const NotFoundComponent: React.SFC<{}> = props => {
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

export default NotFoundContainer;
