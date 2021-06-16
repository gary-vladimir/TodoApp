/*-----LIBRARY CODE-------------------------------------*/

/* function createStore(reducer) {
    let listeners = [];

    // state object
    let state;

    // returns the state
    const getState = () => state;

    // function that it's passed a function
    // that will be called when the state changes
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((e) => e !== listener);
        };
    };

    // function that is called with an action and
    // modifies the state
    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach((listener) => listener());
    };

    return { getState, subscribe, dispatch };
} */

/*---APP CODE---------------------------------------------*/
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const TOGGLE_GOAL = 'TOGGLE_GOAL';

/* -------------------------------------------------------- */

// THIS IS THE ROOT REDUCER
// because we have more than one reducer
// and createStore can only have one
// we need to join them in this reducer

/* function app(state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    };
} */

// the store that has dispatch subscribe and getState methods
const store = Redux.createStore(Redux.combineReducers({ todos, goals }));

// this function will excecute every time the state changes
store.subscribe(() => {
    console.log('The new state is', store.getState());
    const { goals, todos } = store.getState();
    // every time that the state changes it will delete all content from the list
    document.getElementById('todos').innerHTML = '';
    document.getElementById('goals').innerHTML = '';
    // and re render here
    goals.forEach((goal) => {
        addGoalToDOM(goal);
    });
    todos.forEach((todo) => {
        addTodoToDOM(todo);
    });
});

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
                    : Object.assign({}, todo, { status: !todo.status })
            );
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
                    : Object.assign({}, goal, { status: !goal.status })
            );
        default:
            return state;
    }
}
/* --------------------------------------------------------------------------- */
// Action creators
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

/* ---DOM CODE------------------------------------------------------------------ */

// ID generator
function generateId() {
    return (
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36)
    );
}

function addTodo() {
    // getting the user input for todo
    const todoInput = document.getElementById('todoInput');
    const content = todoInput.value;
    // after getting the value it's going to clear
    // the input content
    todoInput.value = '';
    // dispaching to modify the state
    store.dispatch(
        addTodoAction({
            content,
            status: false,
            id: generateId(),
        })
    );
}

function addGoal() {
    // getting the user input for goal
    const goalInput = document.getElementById('goalInput');
    const content = goalInput.value;
    // after getting the value it's going to clear
    // the input content
    goalInput.value = '';
    // dispaching to modify the state
    store.dispatch(
        addGoalAction({
            content,
            status: false,
            id: generateId(),
        })
    );
}
// if the add button is pressed it will add the value to the store
document.getElementById('addTodoBtn').addEventListener('click', addTodo);
document.getElementById('addGoalBtn').addEventListener('click', addGoal);
// and every time the store changes the subscribe will run
// where the items in store will be rendered with this functions
function addTodoToDOM(todo) {
    const liElement = document.createElement('li');
    const imgElement = document.createElement('img');
    liElement.innerText = todo.content;
    imgElement.src = './icons/trash.svg';
    imgElement.id = 'deleteGoalBtn';

    imgElement.addEventListener('click', () => {
        store.dispatch(removeTodoAction(todo.id));
    });

    liElement.style.textDecoration = todo.status ? 'line-through' : 'none';
    liElement.addEventListener('click', () => {
        store.dispatch(toggleTodoAction(todo.id));
    });

    document.getElementById('todos').appendChild(liElement);
    document.getElementById('todos').appendChild(imgElement);
}
function addGoalToDOM(goal) {
    const liElement = document.createElement('li');
    const imgElement = document.createElement('img');
    liElement.innerText = goal.content;
    imgElement.src = './icons/trash.svg';
    imgElement.id = 'deleteGoalBtn';

    imgElement.addEventListener('click', () => {
        store.dispatch(removeGoalAction(goal.id));
    });

    liElement.style.textDecoration = goal.status ? 'line-through' : 'none';
    liElement.addEventListener('click', () => {
        store.dispatch(toggleGoalAction(goal.id));
    });

    document.getElementById('goals').appendChild(liElement);
    document.getElementById('goals').appendChild(imgElement);
}
// this line will modify the state by adding a todo
/* store.dispatch(
    addTodoAction({
        id: '0',
        name: 'Do excersice',
        complete: false,
    })
); */
/* 
-------RULES TO INCREASE PREDICTABILITY--------------------

1.- Only an event can change the state of the store
2.-The function that returns the updated state needs to be a pure function.


-------WHAT IS AN EVENT?-----------------------------------
an event is an object but has to have a type.
it's better practice to pass as little data as possible in each action. 
That is, prefer passing the index or ID of a product rather than the entire product object itself.

example:

{
    type: "ADD_PRODUCT_TO_CART",
    productID: 24
}

------WHAT IS AN ACTION CREATOR?---------------------------
action creators are functions that create/return action objects

example:

const addItem = item => ({
    type: ADD_ITEM,
    item
});


------WHAT IS A PURE FUNCTION?---------------------------
a pure function always returns the same result if the same arguments are given
they depend soley on the arguments passed into them
and do not produce side effects like api request

example:

const add = (a,b){
    return a+b
}

*/
