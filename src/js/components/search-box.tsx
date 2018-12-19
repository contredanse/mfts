import React from 'react';
import './search-box.scss';

type SearchBoxProps = {
    placeHolder?: string;
    value?: string;
    lang?: string;
};

type SearchBoxState = {};

const defaultProps = {
    lang: 'en',
};

export class SearchBox extends React.Component<
    SearchBoxProps & React.HTMLAttributes<HTMLInputElement>,
    SearchBoxState
> {
    static defaultProps = defaultProps;
    render() {
        const { placeHolder, value, lang, ...restProps } = this.props;

        const searchLabel = placeHolder ? placeHolder : lang === 'fr' ? 'Rechercher' : 'Search';

        return (
            <div className="search-box-ctn">
                <input className="search" value={value} type="search" placeholder={searchLabel} {...restProps} />
            </div>
        );
    }
}
