import React from 'react';
import { Link } from 'react-router-dom';

type HomeProps = {};
type HomeState = {};

const LangSelector: React.SFC<any> = props => {
    return (
        <div className="intro-lang-selection">
            <p>
                <Link to="/en/intro">Material for the spine - a movement study</Link>
            </p>
            <p>
                <Link to="/fr/intro">Material for the spine - une étude du mouvement</Link>
            </p>
        </div>
    );
};

export default class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <LangSelector />
            </div>
        );
    }
}
