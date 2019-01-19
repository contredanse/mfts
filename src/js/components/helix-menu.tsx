import React from 'react';
import SpiralMenu from '@thirdparty/spiral.js';
import '@thirdparty/spiral.scss';

import { IJsonMenu, IJsonMenuPage } from '@data/json/data-menu';
import { RouteComponentProps, withRouter } from 'react-router';
import { cloneDeep } from 'lodash-es';

type HelixMenuProps = {
    lang: string;
    jsonDataMenu: IJsonMenu[];
    openedPageId?: string;
} & RouteComponentProps<any>;

type HelixMenuState = {};

const defaultProps = {
    lang: 'en',
};

class HelixMenu extends React.PureComponent<HelixMenuProps, HelixMenuState> {
    static defaultProps = defaultProps;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    containerRef: React.RefObject<HTMLDivElement>;

    spiralMenu: any;

    readonly state: HelixMenuState = {};

    constructor(props: HelixMenuProps) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.containerRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        this.initSpiral();
    }

    componentDidUpdate() {
        // Till having a reset method on the spiral
        this.removeSpiral();
        this.initSpiral();
    }

    componentWillUnmount() {
        this.removeSpiral();
    }

    render() {
        return (
            <div id="spiral-container" ref={this.containerRef}>
                <canvas id="spiral-canvas" ref={this.canvasRef} />
                <span id="spiral-label-container" />
            </div>
        );
    }

    private initSpiral() {
        const { lang, openedPageId, jsonDataMenu } = this.props;
        // Data is cloned to avoid mutation of the underlying data.
        const menuData: IJsonMenu[] = cloneDeep(jsonDataMenu);
        this.spiralMenu = new SpiralMenu({
            container: this.containerRef.current,
            content: menuData,
            language: lang,
            callback: (menuNode: IJsonMenuPage) => {
                this.openPage(menuNode.page_id);
            },
            selectedNodeId: openedPageId,
        });
    }

    private removeSpiral() {
        this.spiralMenu.clear();
        delete this.spiralMenu;
    }

    private openPage = (pageId: string): void => {
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${pageId}`);
    };
}

export default withRouter(HelixMenu);
