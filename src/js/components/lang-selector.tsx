import React from 'react';
import { ApplicationState } from '@src/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as langActions from '@src/store/locale/actions';
import { RouteComponentProps, RouterProps, withRouter } from 'react-router';

// Props passed from mapStateToProps
type PropsFromState = {
    lang: string;
};

// Props passed from mapDispatchToProps
type PropsFromDispatch = {
    setLang: typeof langActions.setLang;
};

type LangSelectorProps = PropsFromDispatch & PropsFromState & RouteComponentProps<{}>;

class LangSelector extends React.Component<LangSelectorProps> {
    constructor(props: LangSelectorProps) {
        super(props);
        console.log('SKDFJS', props);
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
        const { lang: currentLang, setLang } = this.props;
        const nextLang = currentLang === 'en' ? 'fr' : 'en';
        return (
            <button
                style={{ position: 'absolute', zIndex: 1500, top: '200px' }}
                onPointerDown={() => this.updateLang(nextLang)}
            >
                >> Go {nextLang}
            </button>
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
