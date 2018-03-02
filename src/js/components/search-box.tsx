import React from 'react';
import './search-box.scss';

interface IProps {
    placeHolder?: string,
}

interface IState {}

export class SearchBox extends React.Component<IProps & React.HTMLAttributes<HTMLInputElement>, IState> {
    public static defaultProps = {
        placeHolder: '',
    }
    render() {
        const { placeHolder, ...restProps} = this.props;
        return (
            <div className="search-box-ctn">
                <input className="search" type="search" placeholder={placeHolder} {...restProps} />
            </div>
        );
    }
}
