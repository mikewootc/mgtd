import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';
import uuid                             from 'uuid/v4';

const logger = Logger.createWrapper('TodoStore', Logger.LEVEL_DEBUG);

class Todo {
    @observable id        : string;
    @observable title     : string;
    @observable details   : string = '';
    @observable createData: number = 0;
    @observable completed : boolean = false;

    constructor(title: string) {
        this.id = uuid().replace(/-/g, '');
        this.title = title;
        this.createData = Date.now();
        //super();
    }

    toggleComplete() {
        this.completed = !this.completed;
    }
}

export default class TodoStore {
    @observable dicTodos:{[key: string]: Todo;} = {};
    @observable filter = '';

    constructor() {
        let eat:Todo = new Todo('eat');
        let sleep:Todo = new Todo('sleep');
        this.dicTodos[eat.id] = eat;
        this.dicTodos[sleep.id] = sleep;

        //super();
        autorun(() => {
            console.log('filter:', this.filter);
            console.log('todos len:', Object.keys(this.dicTodos).length);
        });
    }

    addTodo(title:string) {
        let todo:Todo = new Todo(title);
        console.log('Add todo:', todo);
        this.dicTodos[todo.id] = todo;
    }

    removeTodo(id:string) {
        console.log('To be removed todo:', id);
        
        if (id in this.dicTodos) {
            console.log('Remove todo:', id);
            delete this.dicTodos[id];
        }
    }
}
