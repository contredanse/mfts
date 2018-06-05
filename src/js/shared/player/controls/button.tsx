import React, { Component, CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

export type ButtonProps = {
    onClick: () => void;
    isEnabled: boolean;
    className: string;
    extraClasses: string;
    style: CSSProperties;
    children: ReactNode;
};

class Button extends Component<ButtonProps> {
    static defaultProps: Partial<ButtonProps> = {
        isEnabled: true,
        className: 'Button',
        extraClasses: '',
        style: {},
        children: null,
    };

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

    protected handleClick = () => {
        if (this.props.isEnabled) {
            this.props.onClick();
        }
    };
}

export default Button;
