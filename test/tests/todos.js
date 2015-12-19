/**
 * Created by dmitriy on 14.12.15.
 */
define(
    ['sinon', 'todos'],
    function (sinon, Todos) {

        suite('todos module', function() {

            var fakeCheckbox,
                disabled, //disableCheckbox
                _todos,
                ul,
                liId = 'test_oncheck_li',
                fakeMediator,
                pubSpy, subSpy,
                todos, //the instance of our Todos "class"
                fakeEvent;

            setup(function() {
                var containerBlock = document.createElement('div');
                document.body.appendChild(containerBlock);
                containerBlock.setAttribute('id', 'todos');
                ul = document.createElement('ul');
                containerBlock.appendChild(ul);
                fakeCheckbox = document.createElement('input');
                fakeCheckbox.setAttribute('type', 'checkbox');
                fakeCheckbox.setAttribute('id', 'checkbox_123');
                var li = document.createElement('li');
                li.appendChild(fakeCheckbox);
                li.setAttribute('id', 'test_oncheck_li'); //that way we can easily find the li later
                ul.appendChild(li);
                disabled = document.createElement('input');
                disabled.setAttribute('type', 'checkbox');
                disabled.disabled = true;
                var liForDisabled = document.createElement('li');
                liForDisabled.appendChild(disabled);
                ul.appendChild(liForDisabled);
                _todos =  window.testing._todos;
                _todos.length = 0;
                _todos.push({id: 123, checked: false});
                pubSpy = sinon.spy();
                subSpy = sinon.spy();
                fakeMediator = {
                    publish: pubSpy,
                    subscribe: subSpy
                };
                todos = new Todos('todos', fakeMediator);
                fakeEvent = {
                    target: fakeCheckbox
                };
            });

            teardown(function() {
                document.body.removeChild(document.getElementById('todos'));
            });

            test('constructor assigns element with specified id to the object\'s property', function() {
                assert.isDefined(todos.elem);
                assert.equal(todos.elem.id, 'todos');
            });

            test('constructor subscribes to todosAvailable channel', function() {
                assert(subSpy.calledOnce);
                assert(subSpy.calledWith('todosAvailable'));
                assert.isFunction(subSpy.args[0][1].fn);
            });

            test('onCheck method sets checked property of corresponding todo to true', function() {
                fakeCheckbox.setAttribute('checked', "checked");
                assert.isFalse(_todos[0].checked);
                todos.onCheck(fakeEvent);
                assert.isTrue(_todos[0].checked);
            });

            test('onCheck method publishes to todosUpdate channel', function() {
                assert.isFalse(pubSpy.called);
                todos.onCheck(fakeEvent);
                assert( (pubSpy.calledOnce && pubSpy.calledWith('todosUpdate', _todos)));
            });

            test('checked item goes to the end of the list', function() {
                assert.notEqual(ul.lastChild, document.getElementById(liId));
                todos.onCheck(fakeEvent);
                assert.strictEqual(ul.lastChild, document.getElementById(liId));
            });

            test('checkbox becomes disabled after it\'s been checked', function() {

                assert.isFalse(fakeCheckbox.disabled);
                todos.onCheck(fakeEvent);
                assert.isTrue(fakeCheckbox.disabled);
            });
        });
    });