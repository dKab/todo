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
            });

            teardown(function() {
                document.body.removeChild(document.getElementById('todos'));
            });

            test('constructor assigns element with specified id to the object\'s property', function() {
                var todos = new Todos('todos');
                assert.isDefined(todos.elem);
            });


            test('onCheck method gets id of changed checkbox', function() {
                var todos = new Todos('todos');
                var fakeCheckbox = document.createElement('input');
                fakeCheckbox.setAttribute('type', 'checkbox');
                var fakeEvent = {
                    target: fakeCheckbox
                };
                assert.isFunction(todos.onCheck, 'DIV');
            });


        });
    });