const UserControllerMongo = require('./UserControllerMongo');
const UserControllerCouch = require('./UserControllerCouch');
//const Controller = require('egg').Controller;

if (process.env.MGTD_DB_TYPE == 'couchdb') {
    module.exports = UserControllerCouch;
} else if (process.env.MGTD_DB_TYPE == 'mongodb') {
    module.exports = UserControllerMongo;
}