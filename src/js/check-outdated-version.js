var outdatedBrowserRework = require('outdated-browser-rework');

outdatedBrowserRework({
    browserSupport: {
        Chrome: 88, // Includes Chrome for mobile devices
        Edge: 15,
        Safari: 11.1,
        'Mobile Safari': 10,
        Firefox: 50,
        Opera: 50,
        Vivaldi: 1,
        // You could specify a version here if you still support IE in 2017.
        // You could also instead seriously consider what you're doing with your time and budget
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
