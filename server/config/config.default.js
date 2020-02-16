const path = require('path');

let dbConfig;
if (process.env.MGTD_DB_TYPE == 'couchdb') {
    dbConfig = {
        couchdb: {
            dbPath     : process.env.MGTD_DB_PATH,   // http://localhost:5984
            dbAdminName: process.env.MGTD_DB_ADMIN,
            dbAdminPass: process.env.MGTD_DB_ADMIN_PASSWORD,
        }
    };
} else if (process.env.MGTD_DB_TYPE == 'mongodb') {
    dbConfig = {
        mongoose: {
            client: {
                url: process.env.MGTD_MONGO, // e.g.: 'mongodb://user:pass@127.0.0.1:12345/db_name',
                options: {},
            },
        },
    };
}

module.exports = (appInfo) => ({
    static: {
        dir: path.join(appInfo.baseDir, 'client/public/'),
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

    logger: {
        level: 'DEBUG', // logs in all level will be written into files
        consoleLevel: 'DEBUG',
    },

    ...dbConfig,
});

