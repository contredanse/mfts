import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import './lang-selector.scss';
import { getNextLang, LanguageContext } from '@src/context/language-context';

type LangSelectorProps = {
    children(props: {
        currentLang: string;
        nextLang: string;
        updateLang: (lang: string) => void;
        toggleLang: () => void;
    }): JSX.Element;
} & RouteComponentProps<any>;

const defaultProps = {};

class LangSelector extends React.Component<LangSelectorProps> {
    static defaultProps = defaultProps;

    constructor(props: LangSelectorProps) {
        super(props);
    }

    updateLang = (lang: string): void => {
        const { pathname: uri } = this.props.location;

        const newLocation = uri.replace(
            // i.e: "/en/page/sensation-and-senses.pointing.parts-of-pointing"
            new RegExp(`^\/(en|fr)\/`),
            `/${lang}/`
        );

        this.props.history.push(newLocation);
    };

    render() {
        const { children } = this.props;
        return (
            <LanguageContext.Consumer>
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
            </LanguageContext.Consumer>
        );
    }
}

const ConnectedLangSelector = withRouter(LangSelector);

export default ConnectedLangSelector;
