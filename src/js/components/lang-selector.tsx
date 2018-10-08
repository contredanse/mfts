import React, { CSSProperties } from 'react';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as langActions from '@src/store/locale/actions';
import { RouteComponentProps, withRouter } from 'react-router';
import './lang-selector.scss';

// Props passed from mapStateToProps
type PropsFromReduxState = {
    lang: string;
};

// Props passed from mapDispatchToProps
type PropsFromReduxDispatchActions = {
    setLang: typeof langActions.setLang;
};

type LangSelectorProps = PropsFromReduxDispatchActions &
    PropsFromReduxState &
    RouteComponentProps<any> & {
        className?: string;
        style?: CSSProperties;
        children(props: { lang: string; updateLang: (lang: string) => void }): any;
    };

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
        const { lang: currentLang, setLang } = this.props;
        const { pathname: uri } = this.props.location;
        const newLocation = uri.replace(
            // i.e: "/en/page/sensation-and-senses.pointing.parts-of-pointing"
            new RegExp(`^\/${currentLang}\/`),
            `/${lang}/`
        );
        setLang(lang);
        this.props.history.push(newLocation);
    };
    render() {
        const { lang: currentLang, className, style, children } = this.props;
        const nextLang = currentLang === 'en' ? 'fr' : 'en';

        return this.props.children({
            updateLang: this.updateLang,
            lang: currentLang,
        });

        return (
            <div className={className}>
                {() => {
                    return children({
                        updateLang: this.updateLang,
                        lang: currentLang,
                    });
                }}
            </div>
        );

        return (
            <div className="round-button">
                <div className="round-button-circle">
                    <a onPointerDown={() => this.updateLang(nextLang)} className="round-button">
                        >> Go {nextLang}
                    </a>
                </div>
            </div>
        );

        return (
            <div className={className} style={style}>
                <button className={className} style={style} onPointerDown={() => this.updateLang(nextLang)}>
                    >> Go {nextLang}
                </button>
            </div>
        );
    }
}
const mapStateToProps = ({ lang: lg }: ApplicationState) => ({
    lang: lg.lang,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setLang: (lang: string) => dispatch(langActions.setLang(lang)),
});

const ConnectedLangSelector = withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(LangSelector)
);
export default ConnectedLangSelector;
