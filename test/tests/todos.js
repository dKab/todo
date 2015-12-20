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

                var countBlock = document.createElement('div');
                countBlock.setAttribute('id', 'count');
                var activeCount = document.createElement('span');
                activeCount.setAttribute('id', 'active-count');
                var archiveCount = document.createElement('span');
                archiveCount.setAttribute('id', 'archive-count');
                countBlock.appendChild(activeCount);
                countBlock.appendChild(archiveCount);
                containerBlock.appendChild(countBlock);
                containerBlock.setAttribute('id', 'todos');
                ul = document.createElement('ul');
                containerBlock.appendChild(ul);
                fakeCheckbox = document.createElement('input');
                fakeCheckbox.setAttribute('type', 'checkbox');
                fakeCheckbox.setAttribute('id', 'checkbox_123');
                var li = document.createElement('li');
                li.appendChild(fakeCheckbox);
                li.setAttribute('id', liId); //that way we can easily find the li later
                ul.appendChild(li);
                disabled = document.createElement('input');
                disabled.setAttribute('type', 'checkbox');
                disabled.setAttribute('checked', 'checked');
                disabled.setAttribute('id', 'checkbox_321');
                disabled.disabled = true;
                var liForDisabled = document.createElement('li');
                liForDisabled.appendChild(disabled);
                ul.appendChild(liForDisabled);
                _todos =  window.testing._todos;
                _todos.length = 0;
                _todos.push({id: 123, checked: false});
                _todos.push( {id: 321, checked: true});
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
                var model = _todos[0];
                assert.isFalse(model.checked);
                todos.onCheck(fakeEvent);
                assert.isTrue(model.checked);
                fakeCheckbox.removeAttribute('checked');
                todos.onCheck(fakeEvent);
                assert.isFalse(model.checked);
            });

            test('onCheck method publishes to todosUpdate channel', function() {
                assert.isFalse(pubSpy.called);
                todos.onCheck(fakeEvent);
                assert( (pubSpy.calledOnce && pubSpy.calledWith('todosUpdate', _todos)));
            });

            test('checked item goes to the end of the list', function() {
                var model = _todos[0];
                assert.notEqual(_todos[_todos.length-1], model, 'model isn\'t last item before we check it');
                assert.notEqual(ul.lastChild, document.getElementById(liId));
                todos.onCheck(fakeEvent);
                assert.strictEqual(ul.lastChild, document.getElementById(liId));
                assert.strictEqual(_todos[_todos.length-1], model, 'model is last item in the array after we check it');
            });

            test('checkbox becomes disabled after it\'s been checked', function() {
                assert.isFalse(fakeCheckbox.disabled);
                todos.onCheck(fakeEvent);
                assert.isTrue(fakeCheckbox.disabled);
            });

            test('adds item to internal todos array', function() {
                _todos.length = 0;
                todos.add({id: 1245});
                assert.equal(_todos.pop().id, 1245);
                todos.add({id: 42});
                assert.equal(_todos.pop().id, 42);
            });

            test('fills the internal array with todos as soon as they are available', function() {
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

            test('render function renders all model items', function() {
                todos.render();
                assert.equal(ul.childNodes.length, 2);
                _todos.push({id: 454});
                todos.render();
                assert.equal(ul.childNodes.length, 3);
            });

            test('render function assigns id correctly', function() {
                todos.render();
                assert.equal(ul.firstChild.getElementsByTagName('input')[0].id, 'checkbox_123');
                assert.equal(ul.lastChild.getElementsByTagName('input')[0].id, 'checkbox_321');
            });

            test('render function renders checked inputs as disabled', function() {
                todos.render();
                assert.isFalse(document.getElementById('checkbox_123').disabled);
                assert.isTrue(document.getElementById('checkbox_321').disabled);
            });

            test('remove method removes item from the dom', function() {
                assert.isNotNull(document.getElementById(liId));
                todos.remove(document.getElementById(liId));
                assert.isNull(document.getElementById(liId));
            });

            test('removes item from the internal array', function() {
                assert.isTrue(_todos.some(function(item) { return item.id == 123; })); //model is there
                todos.remove(document.getElementById(liId));
                assert.isFalse(_todos.some(function(item) { return item.id == 123; })); //model is no longer there
            });


            test('publishes to todosUpdate channel after removing item', function() {
                assert.isFalse(pubSpy.called);
                todos.remove(document.getElementById(liId));
                assert.isTrue(pubSpy.calledWith('todosUpdate', _todos));
            });

            test('updates counters block', function() {
                var activeCountElem = document.getElementById('active-count'),
                    archiveCountElem = document.getElementById('archive-count');
                activeCountElem.innerHTML = '1';
                archiveCountElem.innerHTML = '1';
                todos.remove(document.getElementById(liId));
                assert.equal(activeCountElem.innerHTML, '0');
                assert.equal(archiveCountElem.innerHTML, '1');
                assert.equal(ul.childNodes.length, 1);
                assert.equal(ul.lastChild.getElementsByTagName('input')[0].id, 'checkbox_321');
                todos.remove(ul.lastChild);
                assert.equal(archiveCountElem.innerHTML, '0');
            });

            test('findObj private function', function() {
                var findObj = window.testing._findObj;
                var arr = [
                    {
                        id: 'abgs'
                    },
                    {
                        id: 42
                    },
                    {
                        id: 1111
                    },
                    {
                        id: 456
                    }
                ];

                assert.equal(findObj(arr, 42).index, 1);
                assert.equal(findObj(arr, 42).object.id, 42);
                assert.equal(findObj(arr, 1111).index, 2);
                assert.equal(findObj(arr, 'abgs').index, 0);
                assert.equal(findObj(arr, 456).index, 3);
                assert.isFalse(findObj(arr, 404));
            });

            test('onClick handler calls remove with closest parent li if target has `delete` inside it ', function() {
                var deleteControl = document.createElement('span'),
                    invalidDeleteControl = document.createElement('span');
                deleteControl.innerHTML = 'delete';
                invalidDeleteControl.innerHTML = 'some text';
                var li = document.getElementById(liId);
                li.appendChild(deleteControl);
                li.appendChild(invalidDeleteControl);
                var clickOnDelete  = {
                    target: deleteControl
                };
                var clickSomewhereElse = {
                    target: invalidDeleteControl
                };
                var spi = sinon.spy();
                todos.remove = spi;
                todos.onClick(clickOnDelete);
                assert.isTrue(spi.calledWith(li));
                assert.isTrue(spi.calledOnce);
                todos.onClick(clickSomewhereElse);
                assert.isTrue(spi.calledOnce); //nothing happened
                todos.onClick(clickOnDelete);
                assert.isTrue(spi.calledTwice);
            });


        });
    });