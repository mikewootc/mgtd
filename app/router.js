module.exports = app => {
    const { router, controller } = app;
    //app.get("/", app.jwt, "render.index"); // use old api app.jwt

    router.get('/', controller.home.render);
    router.resources('/user', controller.user);
    router.post('/user/getToken',  controller.user.getToken);
    router.get('/user/testToken', app.jwt, controller.home.testToken);
};
