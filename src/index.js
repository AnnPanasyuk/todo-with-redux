import _ from 'lodash';
import './styles/main.scss';

function component() {
    let element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack', '!'], ' ');
    element.classList.add('hello');

    return element;
}

document.body.appendChild(component());