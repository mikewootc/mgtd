const Controller = require('egg').Controller;

class UserControllerMongo extends Controller {
    async create() {
        try {
            let request = this.ctx.request;
            this.ctx.logger.info('user create:', request.body);
            const username = request.body.username;
            const password = request.body.password;
            let user = await this.ctx.model.User.find({username});
            if (user.length > 0) {
                this.ctx.logger.error('Already existed user:', username);
                this.ctx.body = {result: 'fail', reason: 'UserAlreadyExisted'};
                return;
            }
            this.ctx.logger.debug('user:', user);
            if (username && password && typeof username == 'string' && typeof password == 'string') {
                try {
                    let ret = await this.ctx.model.User.create({username, password});
                    this.ctx.body = {result: 'ok'};
                } catch(err) {
                    throw err;
                }
            }
        } catch(err) {
            throw err;
        }
    }

    async destroy() {
        try {
            this.ctx.logger.info('user destroy:', this.ctx.params.id);

            let ret = await this.ctx.model.User.findOneAndDelete(this.ctx.params.id);
            this.ctx.body = {result: 'ok'};
            return;
        } catch(err) {
            throw err;
        }
    }

    async getToken() {
        let user;
        try {
            this.ctx.logger.debug('getToken');
            let request = this.ctx.request;
            this.ctx.logger.info('user getToken:', request.body);
            user = await this._checkPassword();
        } catch(err) {
            this.ctx.response.body = {result: 'fail', reason: 'NoSuchUser'};
            return;
            //throw err;
        }

        try {
            const jwt = this.ctx.app.jwt;

            if (jwt) {
                this.ctx.logger.debug('get jwt');
                let token = jwt.sign({...user}, this.ctx.app.config.jwt.secret, { expiresIn: '2h' });
                this.ctx.body = {result: 'ok', username: user.username, _id: user._id, token};
            }
        } catch(err) {
            throw err;
        }

    }

    async _checkPassword() {
        try {
            this.ctx.logger.debug('checkPassword');
            let request = this.ctx.request;
            const username = request.body.username;
            const password = request.body.password;

            let user = await this.ctx.model.User.findOne({username, password});
            this.ctx.logger.debug('user:', user);
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

module.exports = UserControllerMongo;
