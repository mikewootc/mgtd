const mocha = require('mocha');
const assert = require('assert');
const axios = require('axios');

const USERNAME = 'mike';
const PASSWORD = '1234';

describe('MochaUser', function() {
    before(function() {
    });

    after(function() {
    });

    beforeEach(function() {
    });

    afterEach(function() {
    });

    it('CreateUser', function(done) {
        (async () => {
            try {
                // 首先确保删除用户(如果存在)
                const resGetToken = await axios.post('http://localhost:7001/user/getToken', {
                    data: {
                        username: USERNAME,
                        password: PASSWORD,
                    }
                });
                if (resGetToken.data._id) {
                    const resDel = await axios.delete(`http://localhost:7001/user/${resGetToken.data._id}`, { });
                }

                const res = await axios.post('http://localhost:7001/user', {
                    params: {
                    },
                    data: {
                        username: USERNAME,
                        password: PASSWORD,
                    },
                    timeout: 5000, // ms
                    responseType: 'json', //  'text', 'arraybuffer', 'blob', 'document', 'json'(默认), 'stream'
                });
                
                assert.equal(res.status, 200);
                assert.equal(res.data.result, 'ok');
                done();
            } catch(err) {
                done(err);
            }
        })();
    });

    it('Token', function(done) {
        (async () => {
            try {
                const res = await axios.post('http://localhost:7001/user/getToken', {
                    data: {
                        username: USERNAME,
                        password: PASSWORD,
                    }
                });
                assert.equal(res.status, 200);
                const res2 = await axios.get('http://localhost:7001/user/testToken', {
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                });
                console.log('res2:', res2.data);
                assert.equal(res2.status, 200);
                assert.equal(res2.data.result, 'ok');
                assert.equal(res2.data.username, USERNAME);
                done();
            } catch(err) {
                done(err);
            }
        })();
    });
});
