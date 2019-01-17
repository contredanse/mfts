const outdatedBrowserRework = require('outdated-browser-rework');

const language = (() => {
    // default
    let lang = 'en';
    if (window.location && window.location.pathname) {
        const matches = window.location.pathname.match(/^\/fr/);
        if (matches) {
            lang = 'fr';
        }
    }
    // from navigator
    if (navigator.language && navigator.language.startsWith('fr')) {
        lang = 'fr';
    }
    return lang;
})();

outdatedBrowserRework({
    browserSupport: {
        Chrome: 76, // Includes Chrome for mobile devices
        Edge: 16,
        Firefox: 54,
        IE: false,
        'Mobile Safari': 10.2,
        Opera: 50,
        // allows 11.1 as minimum
        Safari: 11,
        Vivaldi: 1,
    },
    language: language,
    isUnknownBrowserOK: false,
    messages: {
        en: {
            callToAction: 'Update my browser now',
            close: 'Close',
            outOfDate: 'Sorry, your browser is not supported.',
            update: {
                appStore: 'Please update iOS from the Settings App',
                googlePlay: 'Please install Chrome from Google Play',
                web: 'Update your browser to view this website correctly or use a recent version of Firefox or Chrome.',
            },
            url: 'http://outdatedbrowser.com/',
        },
        fr: {
            callToAction: 'Mettre à jour maintenant ',
            close: 'Fermer',
            outOfDate: "Désolé, votre navigateur n'est pas supporté.",
            update: {
                appStore: "Merci de mettre à jour iOS depuis l'application Réglages",
                googlePlay: "Merci d'installer Chrome depuis le Google Play Store",
                web:
                    'Mettez à jour votre navigateur pour afficher correctement ce site Web ou utilisez une version récente de Firefox ou Chrome.',
            },
            url: 'http://outdatedbrowser.com/fr',
        },
    },
    requireChromeOnAndroid: false,
});
