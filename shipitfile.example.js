module.exports = shipit => {
    // Load shipit-deploy tasks
    require('shipit-deploy')(shipit);

    shipit.initConfig({
        default: {
            deployTo: '/var/website.domain/path',
            repositoryUrl: 'https://github.com/belgattitude/mfts.git',
        },
        staging: {
            servers: 'user@server_url',
        },
    });
};
