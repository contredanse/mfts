import React from 'react';
import './login-form.scss';
import i18n from './login-form.i18n';
import { RouteComponentProps } from 'react-router';
import contredanseLogo from '@assets/images/logo-contredanse.png';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AuthUser, loginUser } from '@src/store/auth/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getFromDictionary } from '@src/i18n/basic-i18n';
import { appConfig } from '@config/config';
import { ExternalUrls } from '@src/core/app-config';

export type LoginFormProps = {
    handleSubmit?: (data: any) => void;
    authError: string | null;
    loading: boolean;
    user?: AuthUser | null;
    authenticated: boolean;
    lang?: string;
    externalUrls?: ExternalUrls;
} & Pick<RouteComponentProps, 'match' | 'history'>;

type LoginFormState = {};

const defaultProps = {
    authError: null,
    loading: false,
    lang: 'en',
    externalUrls: appConfig.getExternalUrls(),
};

export class LoginForm extends React.PureComponent<LoginFormProps, LoginFormState> {
    static defaultProps = defaultProps;

    constructor(props: LoginFormProps) {
        super(props);
    }

    handleSubmit = (data: any) => {
        console.log('FORMDATA', data);
        if (this.props.handleSubmit) {
            this.props.handleSubmit(data);
        }
        return false;
    };

    render() {
        const { authenticated, user, externalUrls } = this.props;

        if (authenticated) {
            return (
                <div className="profile-page-container">
                    <div>Already authenticated ;)</div>
                    <div>User: {user ? user.email : 'unknown'}</div>
                </div>
            );
        }

        return (
            <div className="login-page-container">
                <div className="login-page">
                    <img src={contredanseLogo} alt="Contredanse logo" />

                    <h2>{this.tr('please_login_text')}</h2>
                    <p>
                        {this.tr('not_subscribed_yet')}&nbsp;
                        <a target="_blank" rel="noopener" href={externalUrls!.shopLink}>
                            {this.tr('subscribe_here')}
                        </a>
                    </p>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            this.handleSubmit(values);
                            setSubmitting(false);
                            /*
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 1500);
*/
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string()
                                .email(this.tr('a_valid_email_is_required'))
                                .required(this.tr('required')),
                            password: Yup.string().required(this.tr('required')),
                        })}
                    >
                        {props => {
                            const {
                                values,
                                touched,
                                errors,
                                dirty,
                                isSubmitting,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                handleReset,
                            } = props;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="email" style={{ display: 'block' }}>
                                        {this.tr('email')}
                                    </label>
                                    <input
                                        id="email"
                                        placeholder={this.tr('enter_email')}
                                        type="text"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.email && touched.email ? 'text-input error' : 'text-input'}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="input-feedback">{errors.email}</div>
                                    )}

                                    <label htmlFor="password" style={{ display: 'block' }}>
                                        {this.tr('password')}
                                    </label>
                                    <input
                                        id="password"
                                        placeholder="Password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={
                                            errors.password && touched.password ? 'text-input error' : 'text-input'
                                        }
                                    />
                                    {errors.password && touched.password && (
                                        <div className="input-feedback">{errors.password}</div>
                                    )}
                                    <button type="submit" disabled={isSubmitting}>
                                        {this.tr('submit')}
                                    </button>
                                </form>
                            );
                        }}
                    </Formik>

                    <p>
                        {this.tr('password_forgotten')}&nbsp;
                        <a target="_blank" rel="noopener" href={externalUrls!.resetPassword}>
                            {this.tr('reset_password_here')}
                        </a>
                    </p>
                </div>
            </div>
        );
    }

    private tr = (text: string): string => {
        return getFromDictionary(text, this.props.lang!, i18n);
    };
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    authError: auth.authError,
    loading: auth.loading,
    user: auth.user,
    authenticated: auth.authenticated,
});

const mapDispatchToProps = (dispatch: Dispatch): Pick<LoginFormProps, 'handleSubmit'> => ({
    //handleSubmit: (data: any) => dispatch(uiActions.setFullscreen(isFullscreen)),
    handleSubmit: (data: any) =>
        loginUser(data, () => {
            alert('Success');
        })(dispatch),
});

const ConnectedLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default ConnectedLoginForm;
