const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const TOGGLE_GOAL = 'TOGGLE_GOAL';

const RECEIVE_DATA = 'RECEIVE_DATA';

const checkForYoutube = (store) => (next) => (action) => {
    if (
        action.type === ADD_TODO &&
        action.todo.name.toLowerCase().includes('youtube')
    ) {
        return alert('Nope no youtube allowed');
    }
    if (
        action.type === ADD_GOAL &&
        action.goal.name.toLowerCase().includes('youtube')
    ) {
        return alert('Nope no youtube allowed');
    }
    return next(action);
};

// the store that has dispatch subscribe and getState methods
const store = Redux.createStore(
    Redux.combineReducers({ todos, goals }),
    Redux.applyMiddleware(checkForYoutube)
);

// THIS IS A REDUCER FUNCTION
// it takes the state and an action
// this one is for TODOs
function todos(state = [] /*es6 sytax to array if undefined*/, action) {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo]);
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id);
        case TOGGLE_TODO:
            return state.map((todo) =>
                todo.id !== action.id
                    ? todo
                    : Object.assign({}, todo, { complete: !todo.complete })
            );
        case RECEIVE_DATA:
            return action.todos;

        default:
            return state;
    }
}
// THIS IS A REDUCER FUNCTION
// it takes the state and an action
//and this one is for GOALS
function goals(state = [] /*es6 sytax to array if undefined*/, action) {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal]);
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id);
        case TOGGLE_GOAL:
            return state.map((goal) =>
                goal.id !== action.id
                    ? goal
                    : Object.assign({}, goal, { complete: !goal.complete })
            );
        case RECEIVE_DATA:
            return action.goals;

        default:
            return state;
    }
}

// Action creators

function receiveDataAction(todos, goals) {
    return {
        type: RECEIVE_DATA,
        todos,
        goals,
    };
}

const addTodoAction = (todo) => ({
    type: ADD_TODO,
    todo,
});

const removeTodoAction = (id) => ({
    type: REMOVE_TODO,
    id,
});

const toggleTodoAction = (id) => ({
    type: TOGGLE_TODO,
    id,
});

const addGoalAction = (goal) => ({
    type: ADD_GOAL,
    goal,
});

const removeGoalAction = (id) => ({
    type: REMOVE_GOAL,
    id,
});

const toggleGoalAction = (id) => ({
    type: TOGGLE_GOAL,
    id,
});

// ID generator
function generateId() {
    return (
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36)
    );
}

class App extends React.Component {
    componentDidMount() {
        const { store } = this.props;

        Promise.all([API.fetchTodos(), API.fetchGoals()]).then(
            ([todos, goals]) => {
                store.dispatch(receiveDataAction(todos, goals));
            }
        );

        store.subscribe(() => {
            this.forceUpdate();
        });
    }
    render() {
        const { store } = this.props;
        const { todos, goals } = store.getState();

        return (
            <div id="container">
                <Todos todos={todos} store={this.props.store} />
                <div id="line"></div>
                <Goals goals={goals} store={this.props.store} />
            </div>
        );
    }
}

function List(props) {
    return (
        <ul id={props.id}>
            {props.items.map((e) => (
                <React.Fragment key={e.name}>
                    <li
                        key={e.id}
                        onClick={() => props.toggle(e)}
                        style={{
                            textDecoration: e.complete
                                ? 'line-through'
                                : 'none',
                        }}
                    >
                        {e.name}
                    </li>
                    <img
                        key={e.id + 1}
                        id="deleteGoalBtn"
                        src="./icons/trash.svg"
                        onClick={() => props.remove(e)}
                    ></img>
                </React.Fragment>
            ))}
        </ul>
    );
}

class Todos extends React.Component {
    addItem = (e) => {
        e.preventDefault();
        const name = this.input.value;
        this.input.value = '';

        this.props.store.dispatch(
            addTodoAction({
                id: generateId(),
                name,
            })
        );
    };
    removeItem = (todo) => {
        this.props.store.dispatch(removeTodoAction(todo.id));
    };
    toggle = (todo) => {
        this.props.store.dispatch(toggleTodoAction(todo.id));
    };
    render() {
        return (
            <div id="todoCard">
                <h1>TODO LIST</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Add todo"
                        id="todoInput"
                        ref={(input) => (this.input = input)}
                    />
                    <button id="addTodoBtn" onClick={this.addItem}>
                        <img
                            src="./icons/add.svg"
                            alt="addbutton"
                            id="addBtn"
                            width="25px"
                            height="25px"
                        />
                    </button>
                </div>
                <List
                    id="todos"
                    items={this.props.todos}
                    remove={this.removeItem}
                    toggle={this.toggle}
                />
            </div>
        );
    }
}
class Goals extends React.Component {
    addItem = (e) => {
        e.preventDefault();
        const name = this.input.value;
        this.input.value = '';

        this.props.store.dispatch(
            addGoalAction({
                id: generateId(),
                name,
            })
        );
    };
    removeItem = (goal) => {
        this.props.store.dispatch(removeGoalAction(goal.id));
    };
    toggle = (goal) => {
        this.props.store.dispatch(toggleGoalAction(goal.id));
    };
    render() {
        return (
            <div id="todoCard">
                <h1>GOALS</h1>
                <div>
                    <input
                        type="text"
                        placeholder="Add Goal"
                        id="goalInput"
                        ref={(input) => (this.input = input)}
                    />
                    <button id="addGoalBtn" onClick={this.addItem}>
                        <img
                            src="./icons/add.svg"
                            alt="addbutton"
                            id="addBtn"
                            width="25px"
                            height="25px"
                        />
                    </button>
                </div>
                <List
                    id="goals"
                    items={this.props.goals}
                    remove={this.removeItem}
                    toggle={this.toggle}
                />
            </div>
        );
    }
}

ReactDOM.render(<App store={store} />, document.getElementById('root'));
