/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    ['material-design-lite', 'util', 'lodash/array/findIndex', 'lodash/string/template'],
    function (componentHandler, util, findIndex, compile) {
        var todos = [];
        /*test-code*/
        window.testing = window.testing || {};
        window.testing._todos = todos;
        /*end-test-code*/

        function Todos(id, mediator) {
            this.elem = document.getElementById(id);
            this.mediator = mediator;
        }


        function updateCounter(which, how) {
            var blockToUpdate = document.getElementById('count__' + which);
            var currentCount = +blockToUpdate.innerHTML;
            blockToUpdate.innerHTML = (how < 0) ? Math.max(0, currentCount - 1) : currentCount + 1;
        }

        Todos.prototype.init = function() {
            this.elem.addEventListener('change', this.onCheck.bind(this));
            this.elem.addEventListener('click', this.onClick.bind(this));
            this.mediator.subscribe('todosAvailable', {context: this, fn: this.onTodosAvailable});
            this.mediator.subscribe('newTodo', {context: this, fn: this.addTodo});
        };

        Todos.prototype.onClick = function(event) {
            var target = event.target;
            if (~target.className.indexOf('todo__delete-js-btn')) {
                var id = target.closest('li').id.substr(5);
                this.remove(id);
            }
        };

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.type === 'checkbox') {
                var li = target.closest('li'),
                    idAttr = li.id,
                    id = +idAttr.substr(5),
                    index = findIndex(todos, {id: id});
                if (index > -1) {
                    var model = todos.splice(index, 1).pop();
                    model.checked = target.checked;
                    todos.push(model);
                    this.mediator.publish('todosUpdate', todos);
                    var ul = this.elem.querySelector('ul');
                    ul.appendChild(li);
                    target.disabled = true;
                    updateCounter('archive', +1);
                    updateCounter('active', -1);
                }
            }
        };

        Todos.prototype.add = function (todo) {
            todos.push(todo);
        };

        Todos.prototype.remove = function(id) {
            var index = findIndex(todos, {id: id});
            var model = todos.splice(index, 1).pop();
            var li = document.getElementById('todo_' + id);
            li.parentNode.removeChild(li);
            var countToUpdate = model.checked ? 'archive' : 'active';
            updateCounter(countToUpdate, -1);
            this.mediator.publish('todosUpdate', todos);
        };

        Todos.prototype.onTodosAvailable = function(array) {
            todos.length = 0;
            Array.prototype.push.apply(todos, array);
        };

        Todos.prototype.render = function(callback) {
            var self = this;
            util.loadTemplate('todos.html')
                .then(function(xhr, templateString) {
                    var compiled = compile(templateString, {variable: 'data'});
                    self.elem.innerHTML = compiled({ todos: todos});
                    if (callback) {
                        callback();
                    }
                });
        };

        Todos.prototype.addTodo = function(todo) {
            var model = {
                id: Date.now(),
                text: todo
            };
            todos.unshift(model);
            this.mediator.publish('todosUpdate', todos);
            this.render();
        };

        return Todos;
});