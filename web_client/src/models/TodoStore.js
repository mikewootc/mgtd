import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';


const logger = Logger.createWrapper('TodoStore', Logger.LEVEL_DEBUG);

export default class TodoStore {
    @observable dicTodos = {'1': {title: 'eat'}, '2': {title: 'sleep'}};
    @observable filter = '';

    constructor() {
        //super();
        autorun(() => {
            console.log('filter:', this.filter);
            console.log('todos.len:', Object.keys(this.dicTodos).length);
        });
    }
}
