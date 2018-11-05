import React, { SyntheticEvent } from 'react';

import './overlayed-page-btn.scss';

type Props = {
    text: string;
    onClick: (e: SyntheticEvent<HTMLDivElement>) => void;
};

type State = {};

class OverlayedPageBtn extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const { text, onClick } = this.props;
        return (
            <div className="overlayed-page-btn-container" onClick={onClick}>
                {text}
            </div>
        );
    }
}

export default OverlayedPageBtn;
