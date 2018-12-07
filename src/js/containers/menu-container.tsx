import React from 'react';
import HelixMenu from '@src/components/helix-menu';
import MenuRepository from '@src/models/repository/menu-repository';
import { DataSupportedLangType } from '@src/models/repository/data-repository';
import DocumentMeta from '@src/utils/document-meta';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

type MenuContainerProps = {
    menuRepository: MenuRepository;
    lang: DataSupportedLangType;
    openedPageId?: string;
    previousLocation?: string;
};

type MenuContainerState = {};

class MenuContainer extends React.Component<MenuContainerProps, MenuContainerState> {
    constructor(props: MenuContainerProps) {
        super(props);
    }

    render() {
        const { lang, menuRepository, openedPageId, previousLocation } = this.props;

        let pageId: string | undefined;

        if (openedPageId) {
            pageId = openedPageId;
        } else {
            pageId = this.grepPageFromPreviousLocation(previousLocation);
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <DocumentMeta title={'MFS >> Menu'} />
                <HelixMenu lang={lang} jsonDataMenu={menuRepository.getJsonMenu()} openedPageId={pageId} />
            </div>
        );
    }

    grepPageFromPreviousLocation(previousLocation?: string | null): string | undefined {
        if (previousLocation) {
            // Grep from page spec
            console.log('previousLocation', previousLocation);
            const regExp = /\/(en|fr)\/page\/([a-z0-9-_\.]+)$/i;
            const found = previousLocation.match(regExp);

            if (found) {
                return found[2];
            }
        }
        return undefined;
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
