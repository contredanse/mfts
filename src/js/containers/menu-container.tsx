import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import MenuRepository from '@src/models/repository/menu-repository';
import { DataSupportedLangType } from '@src/models/repository/data-repository';

type MenuContainerProps = {
    menuRepository: MenuRepository;
    lang: DataSupportedLangType;
};

type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    constructor(props: MenuContainerProps) {
        super(props);
    }

    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <HelixMenu jsonDataMenu={this.props.menuRepository.getJsonMenu()} />
            </div>
        );
    }
}

export default MenuContainer;
