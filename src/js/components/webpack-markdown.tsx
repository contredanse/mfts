import React from 'react';

const wrapMarkup = (html: string) => ({
    __html: html,
});

type WebpackMarkdownProps = {
    content: string;
    className?: string;
};

const defaultProps = {
    className: 'markdown',
};

class WebpackMarkdown extends React.PureComponent<WebpackMarkdownProps, {}> {
    constructor(props: WebpackMarkdownProps) {
        super(props);
    }
    render() {
        const { className, content } = this.props;
        return <div className={className} dangerouslySetInnerHTML={wrapMarkup(content)} />;
    }
}

export default WebpackMarkdown;
