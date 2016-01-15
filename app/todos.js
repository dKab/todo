/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    [
        'util',
        'lodash/array/findIndex',
        'lodash/collection/find',
        'lodash/string/template',
        'lodash/string/trim'
    ],
    function (util, findIndex, find, compile, trim) {
        var todos = [],
            conditions = {};

        /*test-code*/
        window.testing = window.testing || {};
        window.testing._todos = todos;
        window.testing._conditions = conditions;
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

        Todos.prototype.finishEditingText = function(e) {
            if (~e.target.className.indexOf('todo__text-js')) {
                if (e.type == 'keydown' && e.keyCode != 13) {
                    return;
                }
                e.target.contentEditabe = false;
                var id = e.target.closest('li').id.substr(5);
                var modelBeingEdited = find(todos, {id: +id});
                if (!modelBeingEdited) {
                    throw new Error('could\'t find corresponding model');
                }
                var newText = trim(e.target.textContent);
                if (newText) {
                    this.mediator.publish('todosUpdate', todos);
                    modelBeingEdited.text = newText
                }
                e.target.textContent = modelBeingEdited.text;

                if (e.type == 'keydown') {
                    e.preventDefault();
                    e.target.blur();
                    return false;
                }
            }
        };

        Todos.prototype.init = function() {
            this.elem.addEventListener('change', this.onCheck.bind(this));
            this.elem.addEventListener('click', this.onClick.bind(this), true);
            this.elem.addEventListener('keydown', this.finishEditingText.bind(this));
            this.elem.addEventListener('blur', this.finishEditingText.bind(this), true);
            this.mediator.subscribe('todosAvailable', {context: this, fn: this.onTodosAvailable});
            this.mediator.subscribe('newTodo', {context: this, fn: this.addTodo});
            this.mediator.subscribe('filterUpdate', {context: this, fn: this.onFilterUpdate});
        };

        Todos.prototype.onFilterUpdate = function(filter) {
            if (filter instanceof Object) {
               if (filter.text === '') {
                   delete conditions.text;
               } else {
                   conditions.text = filter.text;
               }
               conditions.checked = !!filter.checked;
               this.render();
            }
        };

        Todos.prototype.onClick = function(event) {
            var target = event.target;
            if (~target.className.indexOf('todo__delete-btn-js')) {
                var id = target.closest('li').id.substr(5);
                this.remove(id);
            } else if (~target.className.indexOf('todo__text-js')) {
                target.contentEditable = true;
                target.focus();
            }
        };

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.type === 'checkbox') {
                var li = target.closest('li'),
                    idAttr = li.id,
                    id = +idAttr.substr(5),
                    index = findIndex(todos, {id: id});
                if (~index) {
                    var model = todos.splice(index, 1).pop();
                    model.checked = target.checked;
                    todos.push(model);
                    this.mediator.publish('todosUpdate', todos);
                    this.render();
                }
            }

        };

        Todos.prototype.add = function (todo) {
            todos.push(todo);
        };

        Todos.prototype.remove = function(id) {
            var index = findIndex(todos, {id: +id});
            if (~index) {
                var model = todos.splice(index, 1).pop();
                var li = document.getElementById('todo_' + id);
                li.parentNode.removeChild(li);
                var countToUpdate = model.checked ? 'archive' : 'active';
                updateCounter(countToUpdate, -1);
                this.mediator.publish('todosUpdate', todos);
            } else {
                throw new Error('Model with such id has not found');
            }
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
                    var filtered;
                    if (conditions.text) {
                        try {
                            filtered = todos.filter(function(model) {
                                var passes = true;
                                if (conditions.checked === false) {
                                    passes = !model.checked;
                                }
                                if (!passes) {
                                    return false;
                                }
                                if (conditions.text) {
                                    passes = model.text.indexOf(conditions.text) !== -1;
                                }
                                return passes;
                            });
                        } catch(e) {
                            console.error(e);
                            alert('Error ocured!');
                        }
                    } else {
                        filtered = todos;
                    }
                    self.elem.innerHTML = compiled({ todos: filtered});
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