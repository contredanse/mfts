import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import MenuRepository from '@src/models/repository/menu-repository';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import DocumentMeta from '@src/utils/document-meta';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { grepPageIdFromRoute } from '@src/helpers/route-utils';

type MenuContainerProps = {
    menuRepository: MenuRepository;
    lang: DataSupportedLangType;
    openedPageId?: string;
    previousLocation?: string;
};

type MenuContainerState = {};

class MenuContainer extends React.PureComponent<MenuContainerProps, MenuContainerState> {
    constructor(props: MenuContainerProps) {
        super(props);
    }

    render() {
        const { lang, menuRepository, openedPageId, previousLocation } = this.props;

        let pageId: string | undefined;

        if (openedPageId) {
            pageId = openedPageId;
        } else {
            pageId = grepPageIdFromRoute(previousLocation);
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <DocumentMeta title={'MFS >> Menu'} />
                <HelixMenu lang={lang} jsonDataMenu={menuRepository.getJsonMenu()} openedPageId={pageId} />
            </div>
        );
    }
}

const mapStateToProps = ({ nav }: ApplicationState) => ({
    previousLocation: nav.previousLocation,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

export const ConnectedMenuContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MenuContainer);

export default ConnectedMenuContainer;
