import React from 'react';
import { Link } from 'react-router-dom';

interface IProps {}
interface IState {}

const LangSelector: React.SFC<any> = props => {
    return (
        <div className="intro-lang-selection">
            <p>
                <Link to="/intro">Material for the spine - a movement study</Link>
            </p>
            <p>
                <Link to="/intro">Material for the spine - une étude du mouvement</Link>
            </p>
        </div>
    );
};

class HomePage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div className="full-page-slide-ctn">
                <LangSelector />
            </div>
        );
    }
}

export default HomePage;
