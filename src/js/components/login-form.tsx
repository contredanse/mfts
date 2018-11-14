import React from 'react';
import './login-form.scss';
import { RouteComponentProps } from 'react-router';
import contredanseLogo from '@assets/images/logo-contredanse.png';
import { ApplicationState } from '@src/store';
import { Dispatch } from 'redux';
import * as uiActions from '@src/store/ui/actions';
import { connect } from 'react-redux';
import { FullscreenButton } from '@src/components/fullscreen-button';
import { loginUser } from '@src/store/auth/auth';
import { Formik } from 'formik';
import * as Yup from 'yup';

type LoginFormProps = {
    handleSubmit?: (data: any) => void;
    authError: string | null;
    loading: boolean;
} & Pick<RouteComponentProps, 'match' | 'history'>;

type LoginFormState = {};

const defaultProps = {
    authError: null,
    loading: false,
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
        return (
            <div className="login-page-container">
                <div className="login-page">
                    <img src={contredanseLogo} alt="Contredanse logo" />

                    <h2>Please login to your contredanse account !</h2>
                    <p>Here some blah-blah</p>

                    <Formik
                        initialValues={{ email: '' }}
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
                                .email()
                                .required('Required'),
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
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        placeholder="Enter your email"
                                        type="text"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.email && touched.email ? 'text-input error' : 'text-input'}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="input-feedback">{errors.email}</div>
                                    )}

                                    <button
                                        type="button"
                                        className="outline"
                                        onClick={handleReset}
                                        disabled={!dirty || isSubmitting}
                                    >
                                        Reset
                                    </button>
                                    <button type="submit" disabled={isSubmitting}>
                                        Submit
                                    </button>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        );
    }

    render3() {
        const { history, match, authError } = this.props;

        return (
            <div className="login-page-container">
                <div className="login-page">
                    <img src={contredanseLogo} alt="Contredanse logo" />
                    <h2>Please login to your contredanse account !</h2>
                    <p>Here some blah-blah</p>

                    {authError && <div className="error-message">{authError}</div>}

                    <form className="form" onSubmit={this.handleSubmit}>
                        <input type="text" placeholder="Enter email address" />
                        <input type="text" placeholder="My  password" />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }: ApplicationState) => ({
    authError: auth.authError,
    loading: auth.loading,
});

const mapDispatchToProps = (dispatch: Dispatch): Pick<LoginFormProps, 'handleSubmit'> => ({
    //handleSubmit: (data: any) => dispatch(uiActions.setFullscreen(isFullscreen)),
    handleSubmit: (data: any) =>
        loginUser(data, () => {
            alert('onSuccess');
        })(dispatch),
});

const ConnectedLoginForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default ConnectedLoginForm;
