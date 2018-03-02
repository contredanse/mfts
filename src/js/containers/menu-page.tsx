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
            <div style={{textAlign: 'center'}}>
                <img src={helixMenuImg} style={{width: '50%', marginTop: '100px'}}/>
            </div>
        );
    }
}

export default MenuPage;
