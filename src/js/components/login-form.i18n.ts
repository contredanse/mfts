import { BasicI18nDictionary } from '@src/i18n/basic-i18n';

const LoginFormDictionary: BasicI18nDictionary = {
    email: {
        en: 'Email',
        fr: 'Email',
    },
    password: {
        en: 'Password',
        fr: 'Mot de passe',
    },
    submit: {
        en: 'Submit',
        fr: 'Se connecter',
    },
    enter_email: {
        en: 'Enter your email',
        fr: 'Introduisez votre email',
    },
    please_login_text: {
        en: 'Please login to your Contredanse account.',
        fr: 'Veuillez vous connecter avec votre compte Contredanse.',
    },
    no_account_text: {
        en: "Don't have an account ?",
        fr: 'Pas de compte ?',
    },
    register_here: {
        en: 'Register here.',
        fr: 'Enregistrez-vous ici.',
    },
    not_subscribed_yet: {
        en: 'Not subscribed yet ?',
        fr: 'Pas encore abonné ?',
    },
    subscribe_here: {
        en: 'Subscribe here.',
        fr: 'Abonnez-vous ici.',
    },
    no_access_text: {
        en: "Don't have an access ?",
        fr: "Pas d'accès ?",
    },
    get_it_here: {
        en: 'Get it here.',
        fr: 'Obtenez-le ici.',
    },

    password_forgotten: {
        en: 'Password forgotten ?',
        fr: 'Mot de passe oublié ?',
    },
    reset_password_here: {
        en: 'Reset password here.',
        fr: 'Réinitialisez le mot de passe ici.',
    },

    required: {
        en: 'Required',
        fr: 'Requis',
    },
    a_valid_email_is_required: {
        en: 'A valid email is required.',
        fr: 'Entrez une adresse email valide.',
    },

    welcome_to_you: {
        en: 'Welcome',
        fr: 'Bienvenue',
    },

    to_continue_text: {
        en: "In order to continue and if you don't have one",
        fr: "Afin de poursuivre la lecture et si vous ne l'avez pas encore fait",
    },

    get_your_12_months_access: {
        en: 'Get your 12 months access',
        fr: 'Obtenez votre accès 12 mois',
    },

    or_connect: {
        en: 'Or connect',
        fr: 'Ou connectez-vous',
    },

    /**
     * Error messages
     */

    // This error happens when login/pass are incorrect.
    // User should click on 'Password forgotten'
    'fail.credentials': {
        en: 'Invalid credentials, login/password does not match.',
        fr: 'Mot de passe ou email invalide.',
    },

    // This error happens when product access have expired
    'fail.expiry': {
        en: 'Access has expired on %date%.',
        fr: 'Votre accès a expiré le %date%.',
    },

    'fail.payment': {
        en: 'Payment issue.',
        fr: 'Problème de paiement.',
    },

    'fail.no_access': {
        en: 'You need to order an access first.',
        fr: 'Veuillez obtenir un accès.',
    },

    'fail.network': {
        en: 'Network failure, please try again later.',
        fr: 'Erreur réseau, veuillez réessayer plus tard.',
    },

    // Generic error, when none of the above errors applies.
    // possibly due to failure in communication between authentication
    // database
    fail: {
        en: 'Error while verifying your account. Please try again later.',
        fr: 'Erreur lors de la vérification de votre compte. Veuillez réessayer plus tard.',
    },
};

export default LoginFormDictionary;
