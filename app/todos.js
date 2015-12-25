/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    ['material-design-lite', 'util', 'lodash/collection/find', 'lodash/string/template'],
    function (componentHandler, util, find, compile) {
        var todos = [];
        /*test-code*/
        window.testing = window.testing || {};
        window.testing._todos = todos;
        window.testing._findObj = findObj;
        /*end-test-code*/

        function Todos(id, mediator) {
            this.elem = document.getElementById(id);
            this.elem.addEventListener('change', this.onCheck.bind(this));
            this.elem.addEventListener('click', this.onClick.bind(this));
            this.mediator = mediator;
            this.mediator.subscribe('todosAvailable', {context: this, fn: this.onTodosAvailable});
        }

        Todos.prototype.onClick = function(event) {
            var target = event.target;
            if (target.innerHTML !== 'delete') {
                return;
            }
            var node = target;
            while (node !== this.elem) {
                if (node.tagName === 'LI') {
                    this.remove(node);
                    break;
                } else {
                    node = node.parentNode;
                }
            }
        };

        function findObj(array, id) {
            var ind, wanted;
            var found = array.some(function(item, index) {
                ind = index;
                if ( item.id == id ) {
                     wanted = item;
                    return true;
                } else {
                    return false;
                }
            });
            if (found) {
                return { object: wanted, index: ind};
            } else {
                return false;
            }
        }

        Todos.prototype.onCheck = function(e) {
            var target = e.target;
            if (target.getAttribute('type') === 'checkbox') {
                var idAttr = target.getAttribute('id'),
                    id = idAttr.substr(9),
                    found = findObj(todos, id);
                if (found) {
                    todos.splice(found.index, 1);
                    found.object.checked = target.checked;
                    todos.push(found.object);
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

        Todos.prototype.remove = function(li) {
            var checkbox = li.getElementsByTagName('input')[0],
                id = checkbox.id.substr(9),
                model = findObj(todos, id);
            todos.splice(model.index, 1);
            li.parentNode.removeChild(li);
            var countBlockToUpdateId = model.object.checked ? 'archive-count' : 'active-count';
            var countBlock = document.getElementById(countBlockToUpdateId);
            var currentCount = parseInt(countBlock.innerHTML) || 0;
            var newCount = Math.max(0, --currentCount);
            countBlock.innerHTML = newCount;
            this.mediator.publish('todosUpdate', todos);
        };

        Todos.prototype.onTodosAvailable = function(array) {
            todos.length = 0;
            Array.prototype.push.apply(todos, array);
        };

        Todos.prototype.render = function(callback) {
            util.loadTemplate('todos.html')
                .then(function(xhr, templateString) {
                    var compiled = compile(templateString, {variable: 'data'});
                    document.getElementById('items').innerHTML = compiled({ todos: todos});
                    if (callback) {
                        callback();
                    }
                });
        };

        return Todos;
});

