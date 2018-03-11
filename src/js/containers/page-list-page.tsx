import React from 'react';
import { PageOverlay } from '@src/components/page-overlay';
import { SearchBox } from '@src/components/search-box';
import { IDataPage } from '@data/data-pages';
import PageList from '@src/components/page-list';

interface IProps {
    initialData: IDataPage[];
    videosBaseUrl: string;
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
            lang: this.props.lang,
        };
    }

    updateSearch = e => {
        e.preventDefault();
        const fragment = e.target.value;
        const regex = new RegExp(fragment, 'i');
        const filtered = this.props.initialData.filter((page: IDataPage, idx: number) => {
            const keywords = page.keywords[this.props.lang];
            if (keywords !== undefined) {
                return (
                    keywords
                        .join(' ')
                        .concat(page.content.layout)
                        .search(regex) > -1
                );
            }
            return false;
        });
        this.setState({
            pages: filtered,
            searchFragment: fragment,
        });
    };

    openPage = (pageId: string) => {
        this.setState((prevState): IState => ({
            ...prevState,
            selectedPage: pageId,
        }));
    };

    closeVideo = () => {
        this.setState((prevState): IState => ({
            ...prevState,
            selectedPage: undefined,
        }));
    };

    render(): JSX.Element {
        const { pages, selectedPage } = this.state;
        const searchBoxStyle = {
            position: 'fixed',
            top: '70px',
            right: '25px',
            width: '150px',
        } as React.CSSProperties;

        return (
            <PageOverlay>
                <PageList baseUrl={this.props.videosBaseUrl} pages={pages} lang={this.state.lang} />
                {selectedPage === undefined && (
                    <div style={searchBoxStyle}>
                        <SearchBox onChange={e => this.updateSearch(e)} />
                    </div>
                )}
            </PageOverlay>
        );
    }
}

export default PageListPage;
