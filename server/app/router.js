const fs = require('fs');

module.exports = app => {
    const { router, controller } = app;
    //app.get("/", app.jwt, "render.index"); // use old api app.jwt

    router.get('/', controller.home.render);
    //router.get('/sw.js', () => {
    //    app.ctx.body = fs.createReadStream('client/public/sw.js');
    //});

    router.resources('/user', controller.user);
    router.post('/user/getToken',  controller.user.getToken);
    router.get('/user/testToken', app.jwt, controller.home.testToken);
};
