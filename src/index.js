import { createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom'
import PropTypes from "prop-types";
import React from "react";

let expect = (typeof require === 'undefined') ? chai.expect : require('chai').expect;

// Constants block
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const SHOW_ALL = 'SHOW_ALL';
const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';
const SHOW_ACTIVE = 'SHOW_ACTIVE';
const SHOW_COMPLETED = 'SHOW_COMPLETED';

// todo reducer
const todo = (state = [], action) => {
  switch (action.type) {
      case ADD_TODO:
          return {
              id: action.id,
              text: action.text,
              completed: false,
          };

      case TOGGLE_TODO:
          if (state.id !== action.id) {
              return state;
          }
          return {
              ...state,
              completed: !state.completed,
          };

      default:
          return state;
  }
};

// todos reducer
const todos = (state = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                todo(undefined, action),
            ];

        case TOGGLE_TODO:
            return state.map(
                (t) => todo(t, action)
            );

        default:
            return state;
    }

};

// visibility reducer
const visibilityFilter = (
    state = SHOW_ALL,
    action
) => {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;

        default:
            return state;
    }
};

// TODO: emulation Redux combineReducers()
// const combineReducers = (reducers) => {
//     return (state = [], action) => {
//         return Object.keys(reducers).reduce(
//             (nextState, key) => {
//                 nextState[key] = reducers[key](
//                     state[key],
//                     action,
//                 );
//                 return nextState;
//             },
//             {}
//         )
//     }
// };


const todoApp = combineReducers({
    todos,
    visibilityFilter,

});

const testAddTodo  = () => {
    const stateBefore = [];
    const action = {
        type: ADD_TODO,
        id: 0,
        text: 'Learn Redux',
    };
    const stateAfter = [
        {
            id: 0,
            text: 'Learn Redux',
            completed: false,
        }
    ];

    expect(
        todos(stateBefore, action)
    ).to.eql(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: '111',
            completed: false,
        },
        {
            id: 1,
            text: '222',
            completed: false,
        }
    ];

    const action = {
        type: TOGGLE_TODO,
        id: 1,
    };

    const stateAfter = [
        {
            id: 0,
            text: '111',
            completed: false,
        },
        {
            id: 1,
            text: '222',
            completed: true,
        }
    ];

    expect(
        todos(stateBefore, action)
    ).to.eql(stateAfter);
};

testAddTodo();
testToggleTodo();

console.log('Test passed');

// console.log(store.getState());
//
// store.dispatch({
//     id: 1,
//     text: 'Some text',
//     type: 'ADD_TODO'
// });
// console.log(store.getState());
//
// store.dispatch({
//     id: 1,
//     text: 'Some text',
//     type: 'TOGGLE_TODO'
// });
// console.log(store.getState());
//
// store.dispatch({
//     type: 'SET_VISIBILITY_FILTER',
//     filter: 'SHOW_COMPLETED'
// });
// console.log(store.getState());

// let React = require('react');
const { Component } = React;

const Link = ({
    active,
    children,
    onClick
}) => {
    if (active) {
        return <span> {children} </span>
    }
    return (
        <a
            className={'active-link'}
            href='#'
            onClick={e => {
               e.preventDefault();
             onClick();
          }}
        >
            {children}
        </a>
    );
};

class FilterLink extends Component {
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }
    
    componentWillUnmount() {
        this.unsubscribe();
    }
    
    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <Link
                active={
                    props.filter ===
                        state.visibilityFilter
                }
                onClick={() => {
                    store.dispatch({
                        type: SET_VISIBILITY_FILTER,
                        filter: props.filter
                    })
                }}
            >
                {props.children}
            </Link>
        )
    }
}

FilterLink.contextTypes = {
    store: PropTypes.object
};

const Todo = ({
    onClick,
    completed,
    text
}) => (
    <li
        className={'todo-item'}
        key={todo.id}
        onClick={onClick}
        style={{
            textDecoration:
                completed ?
                    'line-through' :
                    'none'
        }}
    >
        {text}
    </li>
);

const TodoList = ({
    todos,
    onTodoClick,
}) => (
    <div className={'list-container'}>
        <ol className={'todo-items'}>
            {todos.map(todo =>
                <Todo
                    key={todo.id}
                    {...todo}
                    onClick={() => onTodoClick(todo.id)}
                />
            )}
        </ol>
    </div>

);

const AddTodo = (props, {store}) => {
    let input;
    return (
        <div className={'add-container'}>
            <div className={'input-container'}>
                <label className={'label'}>
                    Todo name
                </label>
                <input
                    placeholder={'Write your new todo name'}
                    className={'input'}
                    ref={node => {
                        input = node;
                    }}
                />
            </div>
            <button
                className={'add-button'}
                onClick={() => {
                store.dispatch({
                    type: ADD_TODO,
                    id: nextTodoId++,
                    text: input.value
                });
                input.value = '';
            }}>
                Add todo
            </button>
        </div>

    )
};

AddTodo.contextTypes = {
    store: PropTypes.object
};

const Footer = () => (
    <div className={'sort-container'}>
        <div className={'filter-links'}>
            <div className={'show-text-container'}>
                <span className={'show-text'}>
                    Show:
                </span>
            </div>
            {' '}
            <ol className={'sort-items'}>
                <li className={'sort-item'}>
                    <FilterLink
                        filter={SHOW_ALL}
                    >
                        All
                    </FilterLink>
                </li>
                {' '}
                <li className={'sort-item'}>
                    <FilterLink
                        filter={SHOW_ACTIVE}
                    >
                        Active
                    </FilterLink>
                </li>
                {' '}
                <li className={'sort-item'}>
                    <FilterLink
                        filter={SHOW_COMPLETED}
                    >
                        Completed
                    </FilterLink>
                </li>
            </ol>
        </div>
    </div>
);

const getVisibilityTodos = (
    todos,
    filter
) => {
    switch (filter) {
        case SHOW_ALL:
            return todos;
        case SHOW_COMPLETED:
            return todos.filter(
                t => t.completed
            );
        case SHOW_ACTIVE:
            return todos.filter(
                t => !t.completed
            );
        default:
            return todos;
    }
};

class VisibleTodoList extends Component {
    componentDidMount() {
        const { store } = this.context;
        this.unsubscribe = store.subscribe(() => {
            this.forceUpdate();
        })
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const props = this.props;
        const { store } = this.context;
        const state = store.getState();

        return (
            <TodoList
                todos={
                    getVisibilityTodos(
                        state.todos,
                        state.visibilityFilter
                    )
                }
                onTodoClick={id =>
                    store.dispatch({
                        type: TOGGLE_TODO,
                        id
                    })
                }
            />
        )
    }
}

VisibleTodoList.contextTypes = {
    store: PropTypes.object
};

let nextTodoId = 0;

const TodoApp = () => (
    <div className={'todo-app'}>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
    </div>
);

// own Provider Class
class Provider extends Component {
    getChildContext() {
        return {
            store: this.props.store,
        }
    }
    render() {
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store: PropTypes.object
};

const store = createStore(todoApp);

ReactDOM.render(
    <Provider store={store}>
        <TodoApp />
    </Provider>,
    document.getElementById('root'),
);
