var outdatedBrowserRework = require('outdated-browser-rework');

outdatedBrowserRework({
    browserSupport: {
        Chrome: 57, // Includes Chrome for mobile devices
        Edge: 16,
        // allows 11.1 as minimum
        Safari: 11,
        // allows 10.3 as minimum (grid and fetch support)
        'Mobile Safari': 10.2,
        Firefox: 54,
        Opera: 50,
        Vivaldi: 1,
        IE: false,
    },
    requireChromeOnAndroid: false,
    isUnknownBrowserOK: false,
    messages: {
        en: {
            outOfDate: 'Your browser is out of date!',
            update: {
                web: 'Update your browser to view this website correctly. ',
                googlePlay: 'Please install Chrome from Google Play',
                appStore: 'Please update iOS from the Settings App',
            },
            url: 'http://outdatedbrowser.com/',
            callToAction: 'Update my browser now',
            close: 'Close',
        },
    },
});
