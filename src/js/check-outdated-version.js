var outdatedBrowserRework = require('outdated-browser-rework');

outdatedBrowserRework({
    browserSupport: {
        Chrome: 57, // Includes Chrome for mobile devices
        Edge: 16,
        Firefox: 54,
        IE: false,
        'Mobile Safari': 10.2,
        Opera: 50,
        // allows 11.1 as minimum
        Safari: 11,
        Vivaldi: 1,
    },
    isUnknownBrowserOK: false,
    messages: {
        en: {
            callToAction: 'Update my browser now',
            close: 'Close',
            outOfDate: 'Your browser is out of date!',
            update: {
                appStore: 'Please update iOS from the Settings App',
                googlePlay: 'Please install Chrome from Google Play',
                web: 'Update your browser to view this website correctly. ',
            },
            url: 'http://outdatedbrowser.com/',
        },
    },
    requireChromeOnAndroid: false,
});
