import React, { PureComponent, CSSProperties, ReactNode, MouseEvent, KeyboardEvent } from 'react';
import classNames from 'classnames';

export type ButtonProps = {
    onClick?: () => void;
    isEnabled?: boolean;
    className?: string;
    extraClasses?: string;
    style?: CSSProperties;
    children?: ReactNode;
    disableSpaceClick?: boolean;
    tooltip?: string;
    size?: string;
};

export const buttonDefaultProps = {
    isEnabled: true,
    className: 'Button',
    extraClasses: '',
    style: {},
    children: null,
    size: '100%',
    disableSpaceClick: false,
} as ButtonProps;

class Button extends PureComponent<ButtonProps> {
    static defaultProps = buttonDefaultProps;

    render() {
        const { isEnabled, className, extraClasses, style, tooltip, children } = this.props;

        const svgIcon = typeof children === 'function' ? children() : children;

        return (
            <button
                className={classNames(className, { isEnabled }, extraClasses)}
                style={style}
                disabled={!isEnabled}
                title={tooltip}
                onClick={this.handleClick}
                onKeyUp={this.handleKeyUp}
            >
                {svgIcon}
            </button>
        );
    }

    protected handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (this.props.isEnabled && this.props.onClick !== undefined) {
            this.props.onClick();
        }
    };

    protected handleKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (this.props.disableSpaceClick && e && e.key === ' ') {
            e.preventDefault();
        }
    };
}

export default Button;
