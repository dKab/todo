/**
 * Created by dmitriy on 27.12.15.
 */
define(['sinon', 'add-form'], function(sinon, AddForm) {
    suite('AddForm module', function() {

        var containerId = 'todos-app';
        setup(function() {
            var addFormContainer = document.createElement('div');
            addFormContainer.id = 'add-form';
            var input = document.createElement('input');
            input.type = 'text';
            addFormContainer.appendChild(input);
            var appBlock = document.createElement('div');
            appBlock.id = containerId;
            appBlock.appendChild(addFormContainer);
            document.body.appendChild(appBlock);
        });


        teardown(function() {
            document.body.removeChild(document.getElementById(containerId));
        });

        test('add method', function() {
            var mediator = {
                publish: sinon.spy()
            };
            var addForm = new AddForm('add-form', mediator);
            var input = addForm.elem.querySelector('input[type=text]');
            input.value = 'test todo';
            assert.isFalse(mediator.publish.called);
            addForm.add();
            assert.isTrue(mediator.publish.called);
            assert(mediator.publish.calledWith('newTodo', 'test todo'));
            input.value = ' spaces should be stripped   ';
            addForm.add();
            assert(mediator.publish.calledWith('newTodo', 'spaces should be stripped'));
            assert(mediator.publish.calledTwice);
            input.value = '    ';
            addForm.add();
            assert(mediator.publish.calledTwice);
        });
    });
});