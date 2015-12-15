/**
 * Created by dmitriy on 14.12.15.
 */
define(
    ['sinon', 'todos'],
    function (sinon, Todos) {
        suite('todos module', function() {
            setup(function() {

            });

            suite('onCheck method', function() {

                test('gets id of changed checkbox', function() {
                    var containerBlock = document.createElement('div');
                    document.body.appendChild(containerBlock);
                    containerBlock.setAttribute('id', 'todos');
                    var todos = new Todos('todos');
                    var fakeCheckbox = document.createElement('input');
                    fakeCheckbox.setAttribute('type', 'checkbox');
                    var fakeEvent = {
                        target: fakeCheckbox
                    };
                    assert.isFunction(todos.onCheck, 'DIV');
                });
            });

            teardown(function() {

            });


        });
    });