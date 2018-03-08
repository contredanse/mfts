import React from 'react';
import {PageOverlay} from '@src/components/page-overlay';
import {SearchBox} from '@src/components/search-box';
import {IDataPage} from "@data/data-pages";
import PageList from "@src/components/page-list";

interface IProps {
    initialData: IDataPage[];
    lang: 'en' | 'fr';
}
interface IState {
    pages: IDataPage[];
    lang: 'en' | 'fr';
    selectedPage?: string;
    searchFragment?: string;
}

class PageListPage extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.state = {
            pages: this.props.initialData,
            lang: this.props.lang
        };
    }

    updateSearch = (e) => {
        e.preventDefault();
        const fragment = e.target.value;
        const regex = new RegExp(fragment, 'i');
        const filtered = this.props.initialData.filter((page: IDataPage) => {
            const keywords = page.keywords[this.props.lang] && [];
            if (keywords !== undefined) {
                return keywords.join(' ').search(regex) > -1;
            }
            return false;
        });
        this.setState({
            pages: filtered,
            searchFragment: fragment,
        });
    }

    openPage = (pageId: string) => {
        this.setState((prevState): IState => ({
            ...prevState, selectedPage: pageId,
        }));
    }

    closeVideo = () => {
        this.setState((prevState): IState => ({
            ...prevState, selectedPage: undefined,
        }));
    }

    render(): JSX.Element {
        const { pages, selectedPage, searchFragment } = this.state;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        return (
            <PageOverlay>
                <PageList pages={pages} lang={this.state.lang} />
                { selectedPage &&
                    <div style={searchBoxStyle}>
                        <SearchBox value={searchFragment} onChange={(e) => this.updateSearch(e)} />
                    </div>
                }
            </PageOverlay>
        );
    }
}

export default PageListPage;
