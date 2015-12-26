/**
 * Created by dmitriy on 14.12.15.
 */
define(
    ['sinon', 'todos'],
    function (sinon, Todos) {

        suite('todos module', function() {

            var _todos, // private model collection
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


            test('init method subscribes to todosAvailable channel', function() {
                assert.isFalse(subSpy.called);
                todos.init();
                assert(subSpy.calledOnce);
                assert(subSpy.calledWith('todosAvailable'));
                assert.isFunction(subSpy.args[0][1].fn);
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

            test('oncheck method updates counters', function() {
                var checkbox = todos.elem.querySelector('input[type=checkbox]:not(:checked)');

                assert.equal(document.getElementById('count__active').innerHTML, 1);
                assert.equal(document.getElementById('count__archive').innerHTML, 1);
                checkbox.checked = true;
                todos.onCheck({target: checkbox});
                assert.equal(document.getElementById('count__active').innerHTML, 0);
                assert.equal(document.getElementById('count__archive').innerHTML, 2);
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
                assert.notEqual(todos.elem.querySelector('ul').lastChild, li);
                todos.onCheck({target: checkbox});
                assert.strictEqual(todos.elem.querySelector('ul').lastChild, li);
                assert.strictEqual(_todos[_todos.length-1], model, 'model is last item in the array after we check it');
            });

            test('checkbox becomes disabled after it\'s been checked', function() {
                var li = todos.elem.querySelector('li');
                var checkbox = li.querySelector('input[type=checkbox]');
                assert.isFalse(checkbox.disabled);
                todos.onCheck({target: checkbox});
                assert.isTrue(checkbox.disabled);
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

            test('publishes to todosUpdate channel after removing item', function() {
                assert.isFalse(pubSpy.called);
                todos.remove(_todos[0].id);
                assert.isTrue(pubSpy.calledWith('todosUpdate', _todos));
            });

            test('updates counters block', function() {
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
                    target: li.querySelector('.todo__delete-btn')
                };
                var spi = sinon.spy();
                todos.remove = spi;

                assert.isFalse(spi.called);
                todos.onClick(clickOnDelete);
                assert.isTrue(spi.calledWith(modelId));
                assert.isTrue(spi.calledOnce);
            });


        });
    });