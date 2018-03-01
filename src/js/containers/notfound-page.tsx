import React from 'react';

interface IProps {

}
interface IState {
}

export const NotFoundComponent: React.SFC<{}> = (props) => {
    return(
        <h1 style={{color: 'red'}}>Page not found!</h1>
    );
}


class NotFoundPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <NotFoundComponent/>
            </div>
        );
    }
}

export default NotFoundPage;
