/**
 * Created by dmitriy on 14.12.15.
 */
define(
    ['sinon', 'todos'],
    function (sinon, Todos) {

        suite('todos module', function() {

            setup(function() {
                var containerBlock = document.createElement('div');
                document.body.appendChild(containerBlock);
                containerBlock.setAttribute('id', 'todos');
                containerBlock.appendChild(document.createElement('ul'));
            });

            teardown(function() {
                document.body.removeChild(document.getElementById('todos'));
            });

            test('constructor assigns element with specified id to the object\'s property', function() {
                var todos = new Todos('todos', {subscribe: function() {}});
                assert.isDefined(todos.elem);
                assert.equal(todos.elem.id, 'todos');
            });

            test('subscribes to todosAvailable channel', function() {
                var fakeMediator = {},
                    spy = sinon.spy();
                fakeMediator.subscribe = spy;
                var todos = new Todos('todos', fakeMediator);
                assert(spy.calledOnce);
                assert(spy.calledWith('todosAvailable'));
                assert.isFunction(spy.args[0][1].fn);
            });


            test('onCheck method', function() {
                var _todos =  window.testing._todos;
                _todos.length = 0;
                _todos.push({id: 123, checked: false});
                    var spy = sinon.spy(),
                fakeMediator = { subscribe: function() {}, publish: spy};
                var todos = new Todos('todos', fakeMediator);
                var fakeCheckbox = document.createElement('input');
                fakeCheckbox.setAttribute('type', 'checkbox');
                fakeCheckbox.setAttribute('checked', 'checked');
                fakeCheckbox.setAttribute('id', 'checkbox_123');
                var list = todos.elem.getElementsByTagName('ul')[0];
                var li = document.createElement('li');
                var liId = 'test_oncheck_li';
                li.setAttribute('id', 'test_oncheck_li'); //that way we can easily find the li later
                li.appendChild(fakeCheckbox);
                list.appendChild(li);
                list.appendChild(document.createElement('li'));
                var fakeEvent = {
                    target: fakeCheckbox
                };
                todos.onCheck(fakeEvent);
                assert.isTrue(_todos[0].checked, 'sets checked property of corresponding todo to true');
                assert( (spy.calledOnce && spy.calledWith('todosUpdate', _todos)), 'publishes to todosUpdate channel');
                assert.strictEqual(list.lastChild, li, 'checked item goes to the end of the list');
                assert.isTrue(fakeCheckbox.disabled, 'checkbox becomes disabled');
            });


        });
    });