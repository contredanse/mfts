import React from 'react';
import './search-box.scss';

type SearchBoxProps = {
    placeHolder?: string;
    value?: string;
};

type SearchBoxState = {};

export class SearchBox extends React.Component<
    SearchBoxProps & React.HTMLAttributes<HTMLInputElement>,
    SearchBoxState
> {
    public static defaultProps = {
        placeHolder: 'search',
    };
    render() {
        const { placeHolder, value, ...restProps } = this.props;
        return (
            <div className="search-box-ctn">
                <input className="search" value={value} type="search" placeholder={placeHolder} {...restProps} />
            </div>
        );
    }
}
