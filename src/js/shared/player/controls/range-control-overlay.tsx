import React, { Component, CSSProperties, MouseEvent as ReactMouseEvent } from 'react';

import classNames from 'classnames';

// Range control directions
export const ControlDirection = {
    HORIZONTAL: 'HORIZONTAL',
    VERTICAL: 'VERTICAL',
};

export type RangeControlOverlayProps = {
    bounds: (() => void) | { width: number; left: number } | { height: number; top: number };
    onValue: (value: number) => void;
    onChangeStart?: (value: number) => void;
    onChangeEnd?: (value: number) => void;
    onIntent?: (value: number) => void;
    direction?: 'HORIZONTAL' | 'VERTICAL';
    style?: CSSProperties;
    className?: string;
    extraClasses?: string;
};

export type RangeControlOverlayState = {
    isDragging: boolean;
};

/**
 * An invisible overlay that acts as a range mouse control
 * within a specified bounds.
 */
class RangeControlOverlay extends Component<RangeControlOverlayProps, RangeControlOverlayState> {
    static readonly defaultProps: Partial<RangeControlOverlayProps> = {
        //onChangeStart: (value: number) => {},
        //onChangeEnd: (value: number) => {},
        //onIntent: (value: number) => {},
        direction: 'HORIZONTAL',
        style: {},
        className: 'RangeControlOverlay',
    };

    constructor(props: RangeControlOverlayProps) {
        super(props);

        this.state = {
            isDragging: false,
        };
    }

    componentWillUnmount() {
        this.endDrag();
    }

    startDrag = (evt: ReactMouseEvent<HTMLElement>): void => {
        this.setState({ isDragging: true });
        window.addEventListener('mousemove', this.triggerRangeChange);
        window.addEventListener('mouseup', this.endDrag);

        this.toggleSelection('none');

        const startValue = evt ? this.getValueFromMouseEvent(evt) : null;

        if (this.props.onChangeStart !== undefined && startValue !== null) {
            this.props.onChangeStart(startValue);
        }
    };

    endDrag = (evt?: MouseEvent): void => {
        if (evt) {
            this.triggerRangeChange(evt);
        }

        this.setState({ isDragging: false });
        window.removeEventListener('mousemove', this.triggerRangeChange);
        window.removeEventListener('mouseup', this.endDrag);

        this.toggleSelection('');

        const endValue = evt ? this.getValueFromMouseEvent(evt) : null;
        if (this.props.onChangeEnd !== undefined && endValue !== null) {
            this.props.onChangeEnd(endValue);
        }
    };

    toggleSelection(value: 'on' | 'none' | '') {
        const body = document.getElementsByTagName('body')[0];
        (body.style as any)['user-select'] = value;
        (body.style as any)['-webkit-user-select'] = value;
        (body.style as any)['-moz-user-select'] = value;
        (body.style as any)['-ms-user-select'] = value;
    }

    getValueFromMouseEvent(mouseEvent: MouseEvent | ReactMouseEvent<HTMLElement>): number {
        return this.props.direction === ControlDirection.VERTICAL
            ? this.getVerticalValue(mouseEvent.pageY)
            : this.getHorizontalValue(mouseEvent.pageX);
    }

    triggerRangeChange = (mouseEvent: MouseEvent): void => {
        this.props.onValue(this.getValueFromMouseEvent(mouseEvent));
    };

    handleIntentMove = (evt: ReactMouseEvent<HTMLElement>): void => {
        if (!this.state.isDragging) {
            this.triggerIntent(evt);
        }
    };

    triggerIntent(mouseEvent: ReactMouseEvent<HTMLElement>): void {
        const { direction, onIntent } = this.props;

        const value =
            direction === ControlDirection.VERTICAL
                ? this.getVerticalValue(mouseEvent.pageY)
                : this.getHorizontalValue(mouseEvent.pageX);

        if (onIntent !== undefined) {
            onIntent(value);
        }
    }

    getRectFromBounds() {
        const { bounds } = this.props;

        return typeof bounds === 'function' ? bounds() : bounds;
    }

    getHorizontalValue(mouseX: number): number {
        const rect: any = this.getRectFromBounds();
        const scrollX =
            window.pageXOffset !== undefined
                ? window.pageXOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        let dLeft = mouseX - (rect.left + scrollX);
        dLeft = Math.max(dLeft, 0);
        dLeft = Math.min(dLeft, rect.width);

        return dLeft / rect.width;
    }

    getVerticalValue(mouseY: number): number {
        const rect: any = this.getRectFromBounds();
        const scrollY =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        let dTop = mouseY - (rect.top + scrollY);
        dTop = Math.max(dTop, 0);
        dTop = Math.min(dTop, rect.height);

        return 1 - dTop / rect.height;
    }

    render() {
        const { className, extraClasses, style } = this.props;
        const { isDragging } = this.state;

        return (
            <div
                className={classNames(className, extraClasses, { isDragging })}
                style={style}
                onMouseDown={this.startDrag}
                onMouseMove={this.handleIntentMove}
            />
        );
    }
}

export default RangeControlOverlay;
