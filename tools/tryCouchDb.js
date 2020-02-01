#!/usr/bin/env node
'use strict'

const axios = require('axios');

const Nano = require('nano');

// module.exports = {
//     couchDbAdmin: 'xxx',
//     couchDbPass: 'yyy',
// };
const config = require('./mikelocal_config.js');
console.log('config:', config);
const nanoAdmin = Nano(`http://${config.couchDbAdmin}:${config.couchDbPass}@localhost:5984`);

let username = 'jane';
const todoDbName = `todos_${username}`;
let dbTodosCarl;
let nanoCarl;
(async () => {
    try {
        // create user jane
        console.log('Create user');
        const _users = nanoAdmin.use('_users');
        await _users.insert({
            name    : `${username}`,
            password: 'apple',
            roles   : [],
            type    : 'user'
        }, `org.couchdb.user:${username}`);
        console.log('Create user, finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        // create user carl
        console.log('Create user carl');
        const _users = nanoAdmin.use('_users');
        await _users.insert({
            name    : 'carl',
            password: 'apple',
            roles   : [],
            type    : 'user'
        }, `org.couchdb.user:carl`);
        console.log('Create user, finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        // remove db
        console.log('Remove db', todoDbName);
        await nanoAdmin.db.destroy(todoDbName);
        console.log('Remove db, finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        // create db
        console.log('Create db', todoDbName);
        await nanoAdmin.db.create(todoDbName);
        console.log('Create db, finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        console.log('carl set todo_1');
        nanoCarl = Nano(`http://carl:apple@localhost:5984`);
        dbTodosCarl = nanoCarl.use(todoDbName);
        await dbTodosCarl.insert({
            title: 'this is todo_1',
        }, 'todo_1'); 
        console.log('set todo_1 finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        console.log('set security', todoDbName);
        let dbTodosAdmin = nanoAdmin.use(todoDbName);
        await dbTodosAdmin.insert({
            admins: {
                names: [username],
                roles: ['admin']
            },
            readers: {
                names: [],
                roles: []
            }
        }, '_security'); 
        console.log('set security finished');
    } catch(err) {
        console.log(err.message);
    }

    try {
        console.log('carl set todo_2');
        await dbTodosCarl.insert({
            title: 'this is todo_2',
        }, 'todo_2'); 
        console.log('set todo_2 finished');
    } catch(err) {
        console.log(err.message);
    }

//    try {
//        console.log('jane set todo_2');
//        let nanoJane = Nano(`http://jane:apple@localhost:5984`);
//        todos = nanoJane.use(todoDbName);
//        await todos.insert({
//            title: 'this is todo_2',
//        }, 'todo_2'); 
//        console.log('set todo_2 finished');
//    } catch(err) {
//        console.log(err.message);
//    }
})();




//(async () => {
//    try {
//        const res = await axios.put(
//            'http://mike:abcd@localhost:5984/_users/org.couchdb.user:jane',
//            {
//                name: "jane",
//                password: "apple",
//                roles: [],
//                type: "user"
//            },
//            {
//                headers: {
//                },
//                //timeout: 5000, // ms
//                //responseType: 'json', //  'text', 'arraybuffer', 'blob', 'document', 'json'(默认), 'stream'
//            }
//        );
//
//        if (res.status == 201) {
//            console.debug('PUT OK');
//            //res.statusText: 'OK',
//            //res.headers: {},
//            //res.data: {},
//            //res.request: {},
//        } else {
//            console.debug('PUT error:', res.status, res.statusText);
//        }
//    } catch(err) {
//        console.debug('PUT error2:', err.response.status, err.response.statusText);
//    }
//})();


// vim:set tw=0:
