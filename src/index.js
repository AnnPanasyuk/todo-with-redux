'use strict';

import { createStore } from 'redux'

let expect = (typeof require === 'undefined') ? chai.expect : require('chai').expect;

const toggleTodo = (todo) => {
    todo.completed = !todo.completed;
    return todo;
};

const testToggleTodo = () => {
    const todoBefore = {
        id: 0,
        text: 'Learn Redux',
        completed: false
    };

    const todoAfter = {
        id: 0,
        text: 'Learn Redux',
        completed: true
    };

    expect(toggleTodo(todoBefore)).equal(todoAfter);
};

testToggleTodo();
console.log('Test passed');