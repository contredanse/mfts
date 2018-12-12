import React from 'react';

import './not-found.scss';

type NotFoundProps = {
    lang?: string;
};

const NotFound: React.FC<NotFoundProps> = props => {
    return (
        <div className="not-found-container">
            <div className="not-found-inner">
                <h2>Oops, sorry this page was not found.</h2>
            </div>
        </div>
    );
};

export default NotFound;
