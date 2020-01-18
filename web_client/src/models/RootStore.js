//import UserStore        from './UserStore.js';
import TodoStore        from './TodoStore.js';

class RootStore {
    constructor() {
        //this.userStore = new UserStore(this);
        this.todo = new TodoStore(this);
    }
}

const store = window.store = new RootStore();
export default store;
