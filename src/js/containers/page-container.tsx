import React from 'react';
import Page from '@src/components/page';
import { IDataPage } from '@data/data-pages';
import PageRepository from '@src/repositories/page-repository';
import NotFoundContainer from '@src/containers/notfound-container';

interface IProps {
    pageId: string;
    pageRepository: PageRepository;
}
interface IState {
    pageExists: boolean|undefined;
    pageData: IDataPage|undefined;
}

class PageContainer extends React.Component<IProps, IState> {

    readonly state = {
        pageExists: undefined,
        pageData: undefined,
    }

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        try {
            const pageData = await this.props.pageRepository.get(this.props.pageId);
            this.setState((prevState: IState): IState => {
                return {...prevState,
                        pageExists: true,
                        pageData: pageData,
                }
            })
        } catch (e) {
            this.setState((prevState: IState): IState => {
                return {...prevState,
                        pageExists: false,
                        pageData: undefined,
                }
            })
        }
    }

    render() {
        const { pageExists, pageData } = this.state;
        // should not be required, exit if async loading
        // of pageData is not yet present (see componentDidMount())
        if (pageExists === undefined) { return null; }
        return (
            <div>
                {pageData ?
                    <Page pageData={pageData}/> :
                    <NotFoundContainer/>
                }
            </div>
        );
    }
}

export default PageContainer;
