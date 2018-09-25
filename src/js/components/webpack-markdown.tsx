import React from 'react';

const wrapMarkup = (html: string) => ({
    __html: html,
});

type WebpackMarkdownProps = {
    content: string;
};

class WebpackMarkdown extends React.PureComponent<WebpackMarkdownProps, {}> {
    constructor(props: WebpackMarkdownProps) {
        super(props);
    }
    render() {
        return <div className="markdown" dangerouslySetInnerHTML={wrapMarkup(this.props.content)} />;
    }
}

export default WebpackMarkdown;
