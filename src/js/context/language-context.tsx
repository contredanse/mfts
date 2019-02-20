// https://medium.com/@thehappybug/using-react-context-in-a-typescript-app-c4ef7504c858
import * as React from 'react';
import { AppLanguage } from '@src/core/app-language';

const appLang = new AppLanguage();

// Bootstrap initial language
const initialLang = appLang.getInitialLanguage();

type LanguageContextProps = {
    lang: string;
    nextLang: string;
    changeLang: (lang: string) => void;
};

export const defaultLang = initialLang;

export const getNextLang = (currentLang: string) => {
    return currentLang === 'en' ? 'fr' : 'en';
};

export const LanguageContext = React.createContext<LanguageContextProps>({
    lang: defaultLang,
    nextLang: getNextLang(defaultLang),
    changeLang: () => {},
});

type LanguageProviderState = LanguageContextProps;
type LanguageProviderProps = {
    initialLang?: string;
    //children: ReactNode;
};

const defaultProps = {
    initialLang: defaultLang,
};

export class LanguageContextProvider extends React.Component<LanguageProviderProps, LanguageProviderState> {
    static defaultProps = defaultProps;
    readonly state: LanguageProviderState;
    constructor(props: LanguageProviderProps) {
        super(props);
        this.state = {
            lang: props.initialLang!,
            nextLang: getNextLang(props.initialLang!),
            changeLang: this.changeLang,
        };
    }
    changeLang = (lang: string) => {
        this.setState((prevState: LanguageProviderState) => {
            // Persist localStorage
            appLang.persistLanguageInStorage(lang);
            return {
                ...prevState,
                lang: lang,
                nextLang: getNextLang(lang),
            };
        });
    };

    render() {
        return <LanguageContext.Provider value={this.state}>{this.props.children}</LanguageContext.Provider>;
    }
}
