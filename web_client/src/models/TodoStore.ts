import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';
import uuid                             from 'uuid/v4';
import PouchDb                          from 'pouchdb';

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
        } catch(err) {
            logger.error('err:', err);
            throw err;
        }
    }

    loadTodosFromLocalDb = async () => {
        try {
            let all = await this.db.allDocs({include_docs: true});
            logger.debug('loadTodosFromLocalDb. all:', all);
            all.rows.forEach((it, ix, arr) => {[]
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
