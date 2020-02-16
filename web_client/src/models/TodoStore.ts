import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';
import uuid                             from 'uuid/v4';
import PouchDb                          from 'pouchdb';
import { setInterval } from 'timers';

const logger = Logger.createWrapper('TodoStore', Logger.LEVEL_DEBUG);

class Todo {
    @observable _id       : string;
    @observable title     : string;
    @observable details   : string = '';
    @observable createDate: number = 0;
    @observable completed : boolean = false;
    @observable trashed   : boolean = false;

    constructor(title: string) {
        this._id = uuid().replace(/-/g, '');
        this.title = title;
        this.createDate = Date.now();
        //super();
    }

}

export default class TodoStore {
    @observable dicTodos:{[key: string]: Todo;} = {};
    @observable filter = '';
    db:PouchDb;
    couchDbUrl:string;
    couchDbUsername:string;
    couchDbPassword:string;
    syncing:boolean = false;

    constructor() {
        //let eat:Todo = new Todo('eat');
        //let sleep:Todo = new Todo('sleep');
        //this.dicTodos[eat._id] = eat;
        //this.dicTodos[sleep._id] = sleep;

        //super();
        autorun(() => {
            console.log('filter:', this.filter);
            console.log('todos len:', Object.keys(this.dicTodos).length);
        });
    }

    async init() {
        try {
            this.db = new PouchDb('todos');
            await this.loadTodosFromLocalDb();

            await this.setCouchDbSyncInfo(null, null, null);

            this.db.changes({since: 'now', live: true, include_docs: true}).on('change', (e) => {
                logger.debug('db on change:', e);
                if (e.doc) {
                    let id = e.doc._id;
                    if (e.doc._deleted) {
                        if (this.dicTodos[id]) {
                            logger.debug('delete by sync:', this.dicTodos[id]);
                            delete this.dicTodos[id];
                        }
                    } else {
                        logger.debug('touch by sync:', this.dicTodos[id], e.doc);
                        this.dicTodos[id] = e.doc;
                    }

                }
            });

            setInterval(() => {
                if (!this.syncing) {
                    this.syncWithCouch();
                }
                //if (this.couchDbUrl && this.couchDbUsername && this.couchDbPassword) {
                //    this.syncWithCouch();
                //}
            }, 1 * 1000);
        } catch(err) {
            logger.error('err:', err);
            throw err;
        }
    }

    setCouchDbSyncInfo(url:string, username:string, password:string) {
        // this.couchDbUrl = 'http://user:pass@1.2.3.4:5984/todos';
        this.couchDbUrl = 'https://mike:abcd@192.168.1.202:6984/todos';
        //this.couchDbUrl = url;
        this.couchDbUsername = username;
        this.couchDbPassword = password;
    }

    syncWithCouch = async () => {
        try {
            logger.debug('syncWithCouch:', this.couchDbUrl);
            this.syncing = true;
            let remoteCouch = this.couchDbUrl;
            let opts = {live: true};
            //await this.db.replicate.to(remoteCouch, opts);
            //await this.db.replicate.from(remoteCouch, opts);
            await this.db.sync(remoteCouch, opts);
            this.syncing = false;
            logger.debug('syncWithCouch over');
        } catch(err) {
            logger.error('syncWithCouch err:', err);
            throw err;
        }
    }

    loadTodosFromLocalDb = async () => {
        try {
            this.dicTodos = {};
            let all = await this.db.allDocs({include_docs: true});
            logger.debug('loadTodosFromLocalDb. all:', all);
            all.rows.forEach((it:any) => {[]
                if (it && it.doc && it.id) {
                    this.dicTodos[it.id] = it.doc;
                }
            });
        } catch(err) {
            logger.error('err:', err);
            throw err;
        }
    }

    async addTodo(title:string) {
        try {
            let todo:Todo = new Todo(title);
            console.log('Add todo:', todo);
            this.dicTodos[todo._id] = todo;

            await this.db.put(todo);
        } catch(err) {
            logger.error('addTodo err:', err);
            throw err;
        }
    }

    async removeTodo(todoId:string) {
        console.log('To be removed todo:', todoId);
        
        if (todoId in this.dicTodos) {
            console.log('Remove todo:', todoId);
            await this.db.remove(this.dicTodos[todoId]);
            delete this.dicTodos[todoId];
        }
    }

    /**
     * trash or un-trash a todo
     * @param {string} todoId
     * @param {boolean} trash true: trash; false: un-trash
     * @memberof TodoStore
     */
    async trashTodo(todoId:string, trash:boolean = true) {
        let todo = this.dicTodos[todoId];
        if (todo) {
            todo.trashed = trash;
            await this.db.put(todo);
        } else {
            logger.warn('No such todo:', todoId);
        }
    }

    async toggleComplete(todoId:string) {
        let todo = this.dicTodos[todoId];
        if (todo) {
            todo.completed = !todo.completed;
            await this.db.put(todo);
        } else {
            logger.warn('No such todo:', todoId);
        }
    }
}
