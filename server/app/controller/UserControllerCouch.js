const Controller = require('egg').Controller;

class UserControllerCouch extends Controller {
    //constructor() {
    //    super();
    //    this.ctx.logger.info('UserControllerCouch:', process.env.MGTD_DB_PATH, process.env.MGTD_DB_ADMIN, process.env.MGTD_DB_ADMIN_PASSWORD);
    //}

    async create() {
        const {app, request, logger} = this.ctx;
        try {
            logger.info('UserControllerCouch create user, enter. user:', request.body.username);
            const username = request.body.username;
            const password = request.body.password;
            const nano = app.nano;
            let dbUser = nano.use('_users'); // FIXME: ugly design for getting db instance every time.
            
            // create user
            const dbTodoName = `todos_${username}`;
            let ret = await dbUser.insert({
                name: username,
                password,
                roles: [],
                type: 'user',
                privatedbs: [dbTodoName], // 用户私有的db, 创建用户时建立, 删除用户时销毁.
            }, `org.couchdb.user:${username}`);
            logger.debug('dbUser.insert ret:', ret);

            // create user's default todo-db
            logger.debug('create user todo-db:', dbTodoName);
            await nano.db.create(dbTodoName);
            this.ctx.body = {result: 'ok'};
        } catch(err) {
            if (err.error === 'conflict') {
                logger.warn('UserControllerCouch create user, warn. conflict(maybe alreay exist):', request.body.username);
                this.ctx.body = {result: 'fail', reason: 'UserAlreadyExisted'};
            } else {
                logger.error(`UserControllerCouch create user, error for user ${request.body.username}:`, err.message, err.error);
                this.ctx.body = {result: 'fail', reason: err.error};
            }
        }
    }

    async destroy() {
        const {app, request, logger} = this.ctx;
        let user;

        try {
            const nano = app.nano;
            let dbUser = nano.use('_users'); // FIXME: ugly design for getting db instance every time.
            logger.debug('destroy user. params:', this.ctx.params);
            user = await dbUser.get(this.ctx.params.id);

            // destroy user
            logger.debug('destroy user. user:', this.ctx.params.id, 'user:', user);
            await dbUser.destroy(user._id, user._rev);

            // destroy user's dbs. (用户私有的db, 创建用户时建立, 删除用户时销毁)
            if (user && user.privatedbs && user.privatedbs instanceof Array) {
                for (let i = 0; i < user.privatedbs.length; i++) {
                    const dbName = user.privatedbs[i];
                    logger.debug(`destroy private db[${i}]:`, dbName);
                    await nano.db.destroy(dbName);
                }
            }
            this.ctx.body = {result: 'ok'};
        } catch(err) {
            throw err;
        }
    }

    async getToken() {
        const {app, request, logger} = this.ctx;
        let user;
        try {
            logger.debug('getToken');
            const nano = app.nano;
            const request = this.ctx.request;
            const username = request.body.username;
            const password = request.body.password;

            let dbUser = nano.use('_users'); // FIXME: ugly design for getting db instance every time.
            logger.info('user getToken:', request.body);
            user = await dbUser.get(`org.couchdb.user:${username}`);
            logger.debug('user', user);
            //user = await this._checkPassword();
            this.ctx.body = {result: 'ok', username: user.username, _id: user._id};
        } catch(err) {
            logger.error('get Token error:', err.message);
            this.ctx.body = {result: 'fail', reason: 'NoSuchUser'};
            return;
            //throw err;
        }

        try {
            const jwt = app.jwt;

            if (jwt) {
                logger.debug('get jwt');
                let token = jwt.sign({...user}, app.config.jwt.secret, { expiresIn: '2h' });
                this.ctx.body = {result: 'ok', username: user.username, _id: user._id, token};
            }
        } catch(err) {
            throw err;
        }

    }

    async _checkPassword() {
        const {app, request, logger} = this.ctx;
        try {
            logger.debug('checkPassword');
            let request = this.ctx.request;
            const username = request.body.username;
            const password = request.body.password;

            let user = await this.ctx.model.User.findOne({username, password});
            logger.debug('user:', user);
            if (user) {
                return user;
            } else {
                this.ctx.body = {result: 'fail', reason: 'UsernameOrPasswordError'};
                throw new Error('UsernameOrPasswordError');
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = UserControllerCouch;
