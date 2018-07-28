import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import jsonMenuData from '@data/json/data-menu.json';
import { IJsonMenu } from '@data/json/data-menu';

type MenuContainerProps = {};
type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <HelixMenu jsonDataMenu={jsonMenuData as IJsonMenu[]} />
            </div>
        );
    }
}

export default MenuContainer;
