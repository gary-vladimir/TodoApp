/*-----LIBRARY CODE-------------------------------------*/

function createStore(reducer) {
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
}

// the store that has dispatch subscribe and getState methods
const store = createStore(app);

// this function will excecute every time the state changes
store.subscribe(() => {
    console.log('The new state is', store.getState());
});
/*---APP CODE---------------------------------------------*/
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
// THIS IS THE ROOT REDUCER
// because we have more than one reducer
// and createStore can only have one
// we need to join them in this reducer
function app(state = {} /*es6 sytax to obj if undefined*/, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    };
}

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
        default:
            return state;
    }
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

// this line will modify the state by adding a todo
store.dispatch(
    addTodoAction({
        id: '0',
        name: 'Do excersice',
        complete: false,
    })
);
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
