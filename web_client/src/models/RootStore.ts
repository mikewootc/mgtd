//import UserStore        from './UserStore.js';
import TodoStore                        from './TodoStore';
import UiStore                          from './UiStore';

class RootStore {
    todo: TodoStore;
    ui  : UiStore;

    constructor() {
        //this.userStore = new UserStore(this);
        this.todo           = new TodoStore();
        this.ui             = new UiStore();
    }
}

const store = globalThis.store = new RootStore();
export default store;
