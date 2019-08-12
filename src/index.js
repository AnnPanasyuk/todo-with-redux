import { createStore, combineReducers } from 'redux';
import ReactDOM from 'react-dom'

let expect = (typeof require === 'undefined') ? chai.expect : require('chai').expect;

// todo reducer
const todo = (state = [], action) => {
  switch (action.type) {
      case 'ADD_TODO':
          return {
              id: action.id,
              text: action.text,
              completed: false,
          };

      case 'TOGGLE_TODO':
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
        case 'ADD_TODO':
            return [
                ...state,
                todo(undefined, action),
            ];

        case 'TOGGLE_TODO':
            return state.map(
                (t) => todo(t, action)
            );

        default:
            return state;
    }

};

// visibility reducer
const visibilityFilter = (
    state = 'SHOW_ALL',
    action
) => {
    switch (action.type) {
        case 'SET_VISIBILITY_FILTER':
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
        type: 'ADD_TODO',
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
        type: 'TOGGLE_TODO',
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

const store = createStore(todoApp);
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

let React = require('react');
const { Component } = React;

let nextTodoId = 0;

class TodoApp extends Component {
    render() {
        return (
            <div>
                <input ref={node => {
                    this.input = node;
                }}
                />
                <button onClick={() => {
                    store.dispatch({
                        type: 'ADD_TODO',
                        text: this.input.value,
                        id: nextTodoId++,
                    });
                    this.input.value = '';
                }}>
                    Add todo
                </button>
                <ul>
                {this.props.todos.map(todo =>
                    <li
                        key={todo.id}
                        onClick={() => {
                            store.dispatch({
                                type: 'TOGGLE_TODO',
                                id: todo.id
                            });
                        }}
                        style={{
                            textDecoration:
                                todo.completed ?
                                    'line-through' :
                                    'none'
                        }}
                    >
                        {todo.text}
                    </li>
                )}
                </ul>
            </div>
        )
    }

}

const todoRender = () => {
    ReactDOM.render(
        <TodoApp
            todos={store.getState().todos}
        />,
        document.getElementById('root')
    )
};

store.subscribe(todoRender);
todoRender();
