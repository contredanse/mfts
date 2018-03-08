import * as React from 'react';
//import './page-list.scss';
import {IDataPage} from "@data/data-pages";

interface IProps {
    pages: IDataPage[];
    lang: 'en' | 'fr';
}

interface IState {
}

export default class PageList extends React.Component<IProps, IState> {

    handlePageClick(page: IDataPage) {
        //alert('page selected:' + page.id);
    }

    render() {
        const list = this.props.pages;
        //const {baseUrl, onSelected} = this.props;

        console.log('pages', list);

        return (
            <div>
                <table>
                    <thead>
                    <tr>
                        <td></td>
                        <td>Title</td>
                        <td>Layout</td>
                    </tr>
                    </thead>
                    <tbody>
                    {list.map((page: IDataPage, idx: number) => (
                        <tr ref={page.id}>
                            <td>{idx + 1}</td>
                            <td onClick={e => {this.handlePageClick(page)}}>{page.title[this.props.lang]}</td>
                            <td>{page.content.layout}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p>&nbsp;</p>
            </div>
        );
    }
}
