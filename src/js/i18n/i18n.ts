import * as i18n from 'i18next';

const instance = i18n.init({
    interpolation: {
        // React already does escaping
        escapeValue: false,
    },
    lng: 'en', // 'en' | 'fr'
    // Using simple hardcoded resources
    resources: {
        en: {
            translation: {
                appbar: { title: 'Paxton' },
                home: { label: 'Home' },
                page: 'Page',
                name: { label: 'Paxton' },
            },
        },
        fr: {
            translation: {
                appbar: { title: 'Paxton' },
                home: { label: 'Maison' },
                page: 'Page',
            },
        },
    },
});

export default instance;
