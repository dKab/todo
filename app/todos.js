/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    ['material-design-lite'],
    function (componentHandler) {

        var todos = [];

        /*test-code*/
        window.testing = window.testing || {};
        window.testing._todos = todos;
        /*end-test-code*/

        function Todos(id, mediator) {
            this.elem = document.getElementById(id);
            this.elem.addEventListener('change', this.onCheck.bind(this));
            this.mediator = mediator;
            this.mediator.subscribe('todosAvailable', {context: this, fn: this.onTodosAvailable});
        }

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.getAttribute('type') === 'checkbox') {
                var idAttr = target.getAttribute('id'),
                    id = idAttr.substr(9), ind, wanted,
                    foundAndChanged = todos.some(function(item, index) {
                        ind = index;
                    if ( item.id == id ) {
                        wanted = item;
                        item.checked = target.checked;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (foundAndChanged) {
                    todos.splice(ind, 1);
                    todos.push(wanted);
                    this.mediator.publish('todosUpdate', todos);
                    var ul = this.elem.getElementsByTagName('ul')[0];
                    ul.appendChild(target.parentNode);
                    target.disabled = true;
                }
            }
        };

        Todos.prototype.add = function (todo) {
            todos.push(todo);
        };

        Todos.prototype.remove = function(todo) {

        };

        Todos.prototype.onTodosAvailable = function(array) {
            todos.length = 0;
            Array.prototype.push.apply(todos, array);
        };

        Todos.prototype.render = function() {
            var ul = this.elem.getElementsByTagName('ul')[0],
                labelText, inputId, li, label, input, span;
                ul.innerHTML = '';
            for (var i = 0;  i < todos.length; i++) {
                li = document.createElement('li'),
                    label = document.createElement('label'),
                    input = document.createElement('input'),
                    span = document.createElement('span'),
                labelText = document.createTextNode(todos[i].text);
                inputId = 'checkbox_' + todos[i].id;
                label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
                label.setAttribute('for', inputId);
                input.setAttribute('type', 'checkbox');
                input.className = 'mdl-checkbox__input';
                if (todos[i].checked === true) {
                    input.setAttribute('checked', 'checked');
                    input.disabled = true;
                }
                input.setAttribute('id', inputId);
                span.className = 'mdl-checkbox__label';
                span.appendChild(labelText);
                label.appendChild(input);
                label.appendChild(span);
                componentHandler.upgradeElement(label);
                li.appendChild(label);
                ul.appendChild(li);
            }
        };

        return Todos;
});

