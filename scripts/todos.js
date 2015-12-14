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
           // mediator.subscribe('todosAvaiable', );
        }

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.getAttribute('type') === 'checkbox') {
                var idAttr = target.getAttribute('id'),
                    id = idAttr.substr(9);
                this.check(id);
            }
        };

        Todos.prototype.add = function (todo) {
            todos.push(todo);
        };

        Todos.prototype.remove = function(todo) {

        };

        Todos.prototype.check = function (todo) {
            todos.some(function(item) {
               if ( item.id === todo.id ) {
                    item.checked = true;
                    mediator.publish('todosUpdate', todos);
                    return true;
               } else {
                   return false;
               }
            });
        };


        Todos.prototype.render = function() {
            for (var i = 0;  i < [].length; i++) { //TODO change [] to todos
                var ul = this.elem.getElementsByTagName('ul')[0],
                    li = document.createElement('li'),
                    label = document.createElement('label'),
                    input = document.createElement('input'),
                    span = document.createElement('span'),
                    labelText = document.createTextNode(todos[i].text),
                    inputId = 'checkbox_' + todos[i].id;
                label.className = 'mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect';
                label.setAttribute('for', inputId);
                input.setAttribute('type', 'checkbox');
                input.className = 'mdl-checkbox__input';
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

