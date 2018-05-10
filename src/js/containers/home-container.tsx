import React from 'react';
import { Link } from 'react-router-dom';

type HomeContainerProps = {};
type HomeContainerState = {};

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

class HomeContainer extends React.Component<HomeContainerProps, HomeContainerState> {
    constructor(props: HomeContainerProps) {
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

export default HomeContainer;
