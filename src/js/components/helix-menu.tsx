import React from 'react';
import SpiralMenu from '@thirdparty/spiral.js';
import '@thirdparty/spiral.scss';

import { IJsonMenu, IJsonMenuPage } from '@data/json/data-menu';
import { RouteComponentProps, withRouter } from 'react-router';

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
        const { jsonDataMenu, lang } = this.props;
        this.spiralMenu = new SpiralMenu({
            container: this.containerRef.current,
            content: jsonDataMenu,
            language: lang,
            callback: (menuNode: IJsonMenuPage) => {
                this.openPage(menuNode.page_id);
            },
        });
    }

    componentDidUpdate() {
        this.spiralMenu.setLanguage(this.props.lang);
    }

    componentWillUnmount() {
        // The clean up
        this.spiralMenu.clear();
        delete this.spiralMenu;
    }

    openPage = (pageId: string): void => {
        // TODO, move it to container through an 'onPageSelected' prop
        const { lang } = this.props;
        this.props.history.push(`/${lang}/page/${pageId}`);
    };

    render() {
        return (
            <div id="spiral-container" ref={this.containerRef}>
                <canvas id="spiral-canvas" ref={this.canvasRef} />
                <span id="spiral-label-container" />
            </div>
        );
    }
}

export default withRouter(HelixMenu);
