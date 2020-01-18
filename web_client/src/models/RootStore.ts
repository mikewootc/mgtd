//import UserStore        from './UserStore.js';
import TodoStore        from './TodoStore';

class RootStore {
    todo: TodoStore;

    constructor() {
        //this.userStore = new UserStore(this);
        this.todo = new TodoStore();
    }
}

const store = globalThis.store = new RootStore();
export default store;
