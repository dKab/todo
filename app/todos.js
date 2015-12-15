/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    ['material-design-lite', 'mediator'],
    function (componentHandler, mediator) {

        var todos;

        function Todos(id) {
            this.elem = document.getElementById(id);
            this.elem.addEventListener('change', this.onCheck.bind(this));
            mediator.subscribe('todosAvailable', {context: this, fn: this.onTodosAvailable});
        }

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.getAttribute('type') === 'checkbox') {
                var idAttr = target.getAttribute('id'),
                    id = idAttr.substr(9),
                    foundAndChanged = todos.some(function(item) {
                    if ( item.id == id ) {
                        item.checked = target.checked;
                        return true;
                    } else {
                        return false;
                    }
                });
                if (foundAndChanged) {
                    mediator.publish('todosUpdate', todos);
                    var self = this;
                    setTimeout(function() {
                        self.render();
                    }, 300);
                    return true;
                }
            }
        };

        Todos.prototype.add = function (todo) {
            todos.push(todo);
        };

        Todos.prototype.remove = function(todo) {

        };

        Todos.prototype.onTodosAvailable = function(array) {
            todos = array;
        };

        Todos.prototype.render = function() {
            var ul = this.elem.getElementsByTagName('ul')[0],
                li = document.createElement('li'),
                label = document.createElement('label'),
                input = document.createElement('input'),
                span = document.createElement('span'),
                labelText, inputId;
                ul.innerHTML = '';
            for (var i = 0;  i < todos.length; i++) {
                labelText = document.createTextNode(todos[i].text);
                inputId = 'checkbox_' + todos[i].id;
                label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
                label.setAttribute('for', inputId);
                input.setAttribute('type', 'checkbox');
                input.className = 'mdl-checkbox__input';
                if (todos[i].checked === true) {
                    input.setAttribute('checked', 'checked');
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

