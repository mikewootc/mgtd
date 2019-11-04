const Controller = require('egg').Controller;
const fs = require('fs');

class HomeController extends Controller {
    async index() {
        console.log('HomeController index');
        this.ctx.body = 'Hello world';
    }

    async render() {
        //await this.ctx.render('html/index.html');
        this.ctx.body = fs.readFileSync('client/public/index.html', 'utf8');
    }

    async testToken() {
        console.log('testToken. user:', this.ctx.state.user._doc);
        this.ctx.body = {result: 'ok', username: this.ctx.state.user._doc.username};
    }
}

module.exports = HomeController;
