import React, { CSSProperties } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './lang-selector.scss';
import { getNextLang, LanguageContextConsumer } from '@src/context/language-context';

type LangSelectorProps = {
    className?: string;
    style?: CSSProperties;
    children(props: {
        currentLang: string;
        nextLang: string;
        updateLang: (lang: string) => void;
        toggleLang: () => void;
    }): JSX.Element;
} & RouteComponentProps<any>;

const defaultProps = {
    className: 'lang-selector',
    style: {} as CSSProperties,
};

class LangSelector extends React.Component<LangSelectorProps> {
    static defaultProps = defaultProps;

    constructor(props: LangSelectorProps) {
        super(props);
    }

    updateLang = (lang: string): void => {
        //const { lang: currentLang, setLang } = this.props;
        const { pathname: uri } = this.props.location;

        const newLocation = uri.replace(
            // i.e: "/en/page/sensation-and-senses.pointing.parts-of-pointing"
            new RegExp(`^\/(en|fr)\/`),
            `/${lang}/`
        );

        this.props.history.push(newLocation);
    };

    render() {
        const { className, style, children } = this.props;
        return (
            <LanguageContextConsumer>
                {({ lang, nextLang, changeLang }) => {
                    return children({
                        updateLang: (newLang: string) => {
                            changeLang(newLang);
                            this.updateLang(newLang);
                        },
                        toggleLang: () => {
                            const newLang = getNextLang(lang);
                            changeLang(newLang);
                            this.updateLang(newLang);
                        },
                        currentLang: lang,
                        nextLang: nextLang,
                    });
                }}
            </LanguageContextConsumer>
        );
    }
}

const ConnectedLangSelector = withRouter(LangSelector);

export default ConnectedLangSelector;
