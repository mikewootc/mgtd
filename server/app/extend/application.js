const Nano = require('nano');

const NANO = Symbol('Application#nano');

module.exports = {
    get nano() {
        // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
        if (!this[NANO]) {
            const dbUrl = this.config.couchdb.dbPath.replace('http://', `http://${this.config.couchdb.dbAdminName}:${this.config.couchdb.dbAdminPass}@`);
            this.logger.debug('dbUrl:', dbUrl);
            const nanoAdmin = Nano(dbUrl);
            this.logger.debug('nanoAdmin:', typeof nanoAdmin);
            //const dbUser = nanoAdmin.use('_users');
            //app.logger.debug('dbUser:', typeof dbUser);

            this[NANO] = nanoAdmin;
        }
        return this[NANO];
    },
};