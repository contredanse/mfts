import React from 'react';
import './intro.scss';

interface IProps {

}
interface IState {

}

export class Intro extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <div>
                Introduction
            </div>
        );
    }
}
