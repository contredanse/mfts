import React, { CSSProperties } from 'react';
import spiralMenu from '@thirdparty/spiral.js';
import { IDataMenu } from '@data/data-menu';

interface IProps {
    jsonDataMenu: IDataMenu;
}
interface IState {
    width: number | string;
    height: number | string;
}

export default class HelixMenu extends React.Component<IProps, IState> {
    canvas!: HTMLCanvasElement;
    spiralMenu: any;

    constructor(props: IProps) {
        super(props);
        this.state = {
            width: '100%', // imagine this defaults for now
            height: '100%',
        };
    }

    componentDidMount() {
        // 1. Example (the json menu structure is not definitive)
        const jsonDataMenu = this.props.jsonDataMenu;
        console.log('jsonDataMenu', jsonDataMenu);
        console.log('jsonDataMenu.leftSpiral', jsonDataMenu[0]);
        console.log('jsonDataMenu.rightSpiral', jsonDataMenu[1]);

        // 2. Call the spiral menu (automatically renders... maybe better an object)
        this.spiralMenu = spiralMenu(this.canvas);

        // 3. TBD - handlers
        // this.spiralMenu.onPageSelected((pageId) => { this.openPage(pageId) } );

        // 4. Size handlers (actually does not do the real thing)
        window.addEventListener('resize', this.updateDimensions, false);
        window.addEventListener('orientationchange', this.updateDimensions, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
        window.removeEventListener('orientationchange', this.updateDimensions);

        // TBD -
        //   * should be able to unregister internal events of the spiral menu
        //     i.e:
        //        window.addEventListener('resize', onSpiralResize);
        //        this.canvas.addEventListener('mousedown', onSpiralDragMouseDown);
        //        this.canvas.addEventListener('mouseup', onSpiralDragMouseUp);
        //
        //  > i.e. this.spiralMenu.unregister();

        delete this.spiralMenu;
    }

    updateDimensions = () => {
        // Just as an example
        this.setState((prevState: IState): IState => {
            return {
                ...prevState,
                width: '100%', // nothing yet but could be window.innerWidth or parent size...
                height: '100%',
            };
        });
    };

    openPage = (pageId: string): void => {
        alert(`We are going to page ${pageId}, but only at a later point :)`);
        // this.props.openPage(pageId) ?
    };

    render() {
        // TBD:
        // - Who's in charge of the canvasWidth / canvasHeight
        // - For now I let the styles here as plain objects
        //   (later choose scss, css-modules or styled-components if react-native)

        const spiralContainerStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: this.state.width, // Note here ;)
            height: this.state.height,
        } as CSSProperties;

        const spiralStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'pointer',
        } as CSSProperties;

        return (
            <div style={spiralContainerStyle}>
                <canvas
                    style={spiralStyle}
                    ref={(node: HTMLCanvasElement) => {
                        this.canvas = node;
                    }}
                />
            </div>
        );
    }
}
