import {observable, autorun}            from 'mobx';
import Logger                           from 'cpclog';
import uuid                             from 'uuid/v4';

const logger = Logger.createWrapper('UiStore', Logger.LEVEL_DEBUG);

interface UiDataScreenHome {
    addTodoInputText: string;
}

interface UiData {
    screenHome: UiDataScreenHome;
}

const initialStore:UiData = {
    screenHome: {
        addTodoInputText: '',
    },
};

export default class UiStore {
    @observable data: UiData;

    constructor() {
        this.data = initialStore;

        //super();
        autorun(() => {
            //console.log('filter:', this.filter);
            //console.log('todos len:', Object.keys(this.dicTodos).length);
        });
    }
}
