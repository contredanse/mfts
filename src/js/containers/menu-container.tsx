import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import jsonMenuData from '@data/json/data-menu.json';

type MenuContainerProps = {};
type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <HelixMenu jsonDataMenu={jsonMenuData} />
            </div>
        );
    }
}

export default MenuContainer;
