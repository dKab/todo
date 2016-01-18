/**
 * Created by dmitriy on 14.12.15.
 */
define(
    ['sinon', 'todos', 'lodash/collection/find', 'chai'],
    function (sinon, Todos, find, chai) {

        suite('todos module', function() {

            var assert = chai.assert,
                _todos, // private model collection
                pubSpy, subSpy,
                todos; //the instance of our Todos "class"

            setup(function(done) { //this runs before each test case
                _todos =  window.testing._todos; // it's accessable only in testing environment

                _todos.length = 0;
                _todos.push({id: 123, checked: false});
                _todos.push( {id: 321, checked: true});

                pubSpy = sinon.spy();
                subSpy = sinon.spy();
                var fakeMediator = {
                    publish: pubSpy,
                    subscribe: subSpy
                };

                var containerBlock = document.createElement('div');
                containerBlock.setAttribute('id', 'todos');
                document.body.appendChild(containerBlock);
                todos = new Todos('todos', fakeMediator);
                todos.render(done);
            });

            teardown(function() { //this runs after each test case
                document.body.removeChild(document.getElementById('todos'));
            });


            test('constructor assigns element with specified id to the object\'s property', function() {
                assert.isDefined(todos.elem);
                assert.equal(todos.elem.id, 'todos');
            });


            test('init method', function() {
                assert.isFalse(subSpy.called);
                todos.init();
                assert(subSpy.calledThrice);
                assert(subSpy.calledWith('todosAvailable'));
                assert.isFunction(subSpy.args[0][1].fn);
                assert(subSpy.calledWith('newTodo'));
                assert.isFunction(subSpy.args[1][1].fn);
                assert(subSpy.calledWith('filterUpdate'));
                assert.isFunction(subSpy.args[2][1].fn);
            });

            test('onCheck method changes model\'s checked property accordingly to the checkbox', function() {
                var model = _todos[0],
                    li = document.getElementById('todo_' + model.id),
                    checkbox = li.querySelector('input[type=checkbox]');
                assert.isFalse(model.checked);
                checkbox.checked = true;
                todos.onCheck({target: checkbox});
                assert.isTrue(model.checked);
                checkbox.checked = false;
                todos.onCheck({target: checkbox});
                assert.isFalse(model.checked);
            });

            test('onCheck method publishes to todosUpdate channel', function() {
                assert.isFalse(pubSpy.called);
                var checkbox = todos.elem.querySelector('input[type=checkbox]');
                todos.onCheck({target: checkbox});
                assert( (pubSpy.calledOnce && pubSpy.calledWith('todosUpdate', _todos)));
            });

            test('checked item goes to the end of the list', function() {
                var model = _todos[0],
                    li = document.getElementById('todo_' + model.id),
                    checkbox = li.querySelector('input[type=checkbox]');
                assert.notEqual(_todos[_todos.length-1], model, 'model isn\'t last item before we check it');
                todos.onCheck({target: checkbox});
                assert.strictEqual(_todos[_todos.length-1], model, 'model is last item in the array after we check it');
            });

            test('onCheck handler calls render method', function() {
                var model = _todos[0],
                    li = document.getElementById('todo_' + model.id),
                    checkbox = li.querySelector('input[type=checkbox]'),
                    spy = sinon.spy();
                todos.render = spy;
                todos.onCheck({target: checkbox});
                assert(spy.calledOnce);
            });

            test('adds item to internal todos array', function() {
                _todos.length = 0;
                todos.add({id: 1245});
                assert.equal(_todos.pop().id, 1245);
                todos.add({id: 42});
                assert.equal(_todos.pop().id, 42);
            });

            test('fills the internal array with todos', function() {
                var array = [
                    {
                        id: 132
                    },
                    {
                        id: 543
                    }
                ];
                _todos.length = 0;
                todos.onTodosAvailable(array);
                assert.equal(_todos.length, 2);
                assert.equal(_todos.pop().id, 543);
                assert.equal(_todos.pop().id, 132);
            });

            test('remove method removes item from the dom', function() {
                var modelId = _todos[0].id,
                    li = document.getElementById('todo_' + modelId);
                assert.isNotNull(li);
                todos.remove(modelId);
                assert.isNull(document.getElementById('todo_' + modelId));
            });

            test('remove method removes model from internal array', function() {
                var modelId = _todos[0].id;
                todos.remove(modelId);
                assert.isFalse(_todos.some(function(item) { return item.id == modelId; })); //model is no longer there
            });

            test('remove method publishes to todosUpdate channel after removing item', function() {
                assert.isFalse(pubSpy.called);
                todos.remove(_todos[0].id);
                assert.isTrue(pubSpy.calledWith('todosUpdate', _todos));
            });

            test('remove method updates counters block', function() {
                var activeCountElem = document.getElementById('count__active'),
                    archiveCountElem = document.getElementById('count__archive');
                activeCountElem.innerHTML = '1';
                archiveCountElem.innerHTML = '1';
                todos.remove(_todos[0].id);
                assert.equal(activeCountElem.innerHTML, '0');
                assert.equal(archiveCountElem.innerHTML, '1');
                todos.remove(_todos[0].id);
                assert.equal(archiveCountElem.innerHTML, '0');
            });

            test('onClick handler calls remove with model\'s id if target is delete button', function() {
                var li = todos.elem.querySelector('li'),
                    modelId = li.id.substr(5);
                var clickOnDelete  = {
                    target: li.querySelector('.todo__delete-btn-js')
                };
                var spi = sinon.spy();
                todos.remove = spi;

                assert.isFalse(spi.called);
                todos.onClick(clickOnDelete);
                assert.isTrue(spi.calledWith(modelId));
                assert.isTrue(spi.calledOnce);
            });

            test('addTodo method ', function() {
                assert.isFalse(_todos.some(function(model) { return model.text === 'test todo'}));
                assert.isFalse(pubSpy.called);
                var count = _todos.length;
                todos.render = sinon.spy();
                todos.addTodo('test todo');
                assert.isDefined(_todos[0].id);
                assert.equal(_todos[0].text, 'test todo');
                assert(pubSpy.called);
                assert(pubSpy.calledWith('todosUpdate', _todos));
                assert.equal(_todos.length, count + 1);
                assert(todos.render.calledOnce);
            });

            test('finishEditingText', function() {
                var span = todos.elem.querySelector('.todo__text-js'),
                    id = span.closest('li').id.substr(5),
                    model = find(_todos, {id: +id});
                var event = {
                    target: span
                };
                var newText = 'new awesome text';
                span.textContent = newText;
                todos.finishEditingText(event);
                assert.equal(model.text, newText);
                assert(pubSpy.calledOnce);
                assert(pubSpy.calledWith('todosUpdate', _todos));

                span.textContent = '     ';
                todos.finishEditingText(event);
                assert.equal(model.text, newText); //model value haven't changed
                assert.equal(span.textContent, newText);
                assert(pubSpy.calledOnce);
                span.textContent = '';
                todos.finishEditingText(event);
                assert.equal(model.text, newText); //still haven't changed
                assert.equal(span.textContent, newText);
                assert(pubSpy.calledOnce);
                span.textContent = '123';
                todos.finishEditingText(event);
                assert.equal(model.text, '123'); //changed now
                assert.equal(span.textContent, '123');
                assert(pubSpy.calledTwice);
            });

            test('onFilterUpdate', function() {
                var _conditions = window.testing._conditions;
                todos.render = sinon.spy();
                todos.onFilterUpdate();
                assert(!todos.render.called);
                todos.onFilterUpdate({text: 'fdgds'});
                assert(todos.render.called);
                assert.isFalse(_conditions.checked);
                assert.equal(_conditions.text, 'fdgds');
                todos.onFilterUpdate({text: '', checked: true});
                assert.isUndefined(_conditions.text);
                assert.isTrue(_conditions.checked);
            });
        });
    });