import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';
import uuid                             from 'uuid/v4';

const logger = Logger.createWrapper('TodoStore', Logger.LEVEL_DEBUG);

class Todo {
    @observable id     : string;
    @observable title  : string;
    @observable details: string = '';

    constructor(title: string) {
        this.id = uuid().replace(/-/g, '');
        this.title = title;
        //super();
    }
}

export default class TodoStore {
    dicTodos:{[key: string]: Todo;} = {};
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
}
