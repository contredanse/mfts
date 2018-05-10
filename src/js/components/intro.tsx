import React from 'react';
import './intro.scss';

type IntroProps = {};
type IntroState = {};

export class Intro extends React.Component<IntroProps, IntroState> {
    constructor(props: IntroProps) {
        super(props);
    }

    render() {
        return <div>Introduction</div>;
    }
}
