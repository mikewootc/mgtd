const path = require('path');

module.exports = (appInfo) => ({
    static: {
        dir: path.join(appInfo.baseDir, 'client/public'),
    },

    security: {
        csrf: {
            enable: false,
        },
    },

    keys: 'c1o2o3k4i5e',

    jwt: {
        secret: "123456"
    },

    mongoose: {
        client: {
            url: process.env.MONGO, // e.g.: 'mongodb://user:pass@127.0.0.1:12345/db_name',
            options: {},
        },
    },

    logger: {
        level: 'DEBUG', // logs in all level will be written into files
        consoleLevel: 'DEBUG',
    },
});

