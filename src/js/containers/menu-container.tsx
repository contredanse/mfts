import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import helixMenuImg from '@assets/helix-menu.gif';
import jsonMenuData from '@data/data-menu.json';

interface IProps {}
interface IState {}

class MenuContainer extends React.Component<IProps, IState> {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <HelixMenu jsonDataMenu={jsonMenuData} />
                <img src={helixMenuImg} style={{ width: '50%', marginTop: '100px' }} />
            </div>
        );
    }
}

export default MenuContainer;
