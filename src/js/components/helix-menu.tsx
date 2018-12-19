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
        // Yes because the provided spiral change
        // underlying data and does not provide
        // a reset
        this.removeSpiral();
        this.initSpiral();
    }

    initSpiral() {
        const { lang, openedPageId, jsonDataMenu } = this.props;
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

    removeSpiral() {
        this.spiralMenu.clear();
        delete this.spiralMenu;
    }

    render() {
        console.log('HELIX::RENDER');
        return (
            <div id="spiral-container" ref={this.containerRef}>
                <canvas id="spiral-canvas" ref={this.canvasRef} />
                <span id="spiral-label-container" />
            </div>
        );
    }

    componentWillUnmount() {
        // The clean up
        this.removeSpiral();
    }

    private openPage = (pageId: string): void => {
        // TODO, move it to container through an 'onPageSelected' prop
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${pageId}`);
    };
}

export default withRouter(HelixMenu);
