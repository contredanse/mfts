import React from 'react';
import helixMenuImg from '@assets/helix-menu.gif';


interface IProps {

}
interface IState {
}

class MenuPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <img src={helixMenuImg} />
            </div>
        );
    }
}

export default MenuPage;
