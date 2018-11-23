import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import MenuRepository from '@src/models/repository/menu-repository';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import DocumentMeta from '@src/utils/document-meta';

type MenuContainerProps = {
    menuRepository: MenuRepository;
    lang: DataSupportedLangType;
    openedPageId?: string;
};

type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    constructor(props: MenuContainerProps) {
        super(props);
    }

    render() {
        const { lang, menuRepository, openedPageId } = this.props;
        return (
            <div style={{ textAlign: 'center' }}>
                <DocumentMeta title={'MFS >> Menu'} />
                <HelixMenu lang={lang} jsonDataMenu={menuRepository.getJsonMenu()} openedPageId={openedPageId} />
            </div>
        );
    }
}

export default MenuContainer;
