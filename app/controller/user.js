const Controller = require('egg').Controller;
const fs = require('fs');

class UserController extends Controller {
    async create() {
        try {
            let request = this.ctx.request;
            this.ctx.logger.info('user create:', this.ctx.request.body.data);
            const username = request.body.data.username;
            const password = request.body.data.password;
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
        try {
            this.ctx.logger.debug('getToken');
            let request = this.ctx.request;
            let token;
            const user = await this._checkPassword();
            const jwt = this.ctx.app.jwt;

            if (jwt) {
                this.ctx.logger.debug('get jwt');
                token = jwt.sign({...user}, this.ctx.app.config.jwt.secret, { expiresIn: '2h' });
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
            const username = request.body.data.username;
            const password = request.body.data.password;

            let user = await this.ctx.model.User.findOne({username, password});
            this.ctx.logger.debug('user:', user.username, user._id);
            if (user) {
                return user;
            } else {
                this.ctx.body = {result: 'fail', reason: 'UsernameOrPasswordError'};
                throw new Error('  UsernameOrPasswordError');
            }
        } catch(err) {
            throw err;
        }
    }
}

module.exports = UserController;
