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
};

export const buttonDefaultProps = {
    isEnabled: true,
    className: 'Button',
    extraClasses: '',
    style: {},
    children: null,
    disableSpaceClick: false,
} as ButtonProps;

class Button extends PureComponent<ButtonProps> {
    static defaultProps = buttonDefaultProps;

    render() {
        const { isEnabled, className, extraClasses, style, tooltip, children } = this.props;

        return (
            <button
                className={classNames(className, { isEnabled }, extraClasses)}
                style={style}
                disabled={!isEnabled}
                title={tooltip}
                onClick={this.handleClick}
                onKeyUp={this.handleKeyUp}
            >
                {children}
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
