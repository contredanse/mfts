import React from 'react';
import './search-box.scss';

interface IProps {
    placeHolder?: string;
    value?: string;
}

interface IState {}

export class SearchBox extends React.Component<IProps & React.HTMLAttributes<HTMLInputElement>, IState> {
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
