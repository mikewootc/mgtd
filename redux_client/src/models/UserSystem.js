import axios                        from 'axios';
import Logger                       from 'cpclog';
//import url                          from 'url';
//import pinyin                       from 'js-pinyin';

//import * as Errors from '../../common/Errors.js'

const logger = Logger.createWrapper('UserSystem', Logger.LEVEL_DEBUG);
//pinyin.setOptions({checkPolyphone: false, charCase: 1});

//const SERVER_ADDR = '';

class UserSystem {
    // NOTICE: 这里的serverAddr指向信令服务器地址, 而非用户服务器地址, 因为请求将由信令服务器转发.
    constructor(accountType, username, password, serverAddr) {
        this.accountType = accountType;
        this.username    = username;
        this.password    = password;
        this.userId      = null;
        this.serverAddr  = serverAddr || '';
        logger.debug(Logger.BLUE, 'serverAddr:', this.serverAddr);
    }

    async login(username, password) {
        try {
            const resGetToken = await axios.post(this.serverAddr + '/user/getToken', {
                data: {
                    username,
                    password,
                }
            });

            if (resGetToken.status != 200) {
                let err = new Error('LoginError');
                err.status = res.status;
                throw err;
            }

            if (resGetToken && resGetToken.data && resGetToken.data._id) {
                this.userId = resGetToken.data._id;
                logger.info(Logger.GREEN, `Login OK, userId: ${this.userId}`);
                return this.userId;
            }

            return res.data;
        } catch(err) {
            throw err;
        }
    }

}

//module.exports = UserSystem;
export default UserSystem;
