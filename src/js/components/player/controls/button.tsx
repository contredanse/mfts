import React, { PureComponent, CSSProperties, ReactNode, MouseEvent } from 'react';
import classNames from 'classnames';

export type ButtonProps = {
    onClick?: () => void;
    isEnabled?: boolean;
    className?: string;
    extraClasses?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

class Button extends PureComponent<ButtonProps> {
    static defaultProps = {
        isEnabled: true,
        className: 'Button',
        extraClasses: '',
        style: {},
        children: null,
    } as ButtonProps;

    render() {
        const { isEnabled, className, extraClasses, style, children } = this.props;

        return (
            <button
                className={classNames(className, { isEnabled }, extraClasses)}
                style={style}
                disabled={!isEnabled}
                onClick={this.handleClick}
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
}

export default Button;
