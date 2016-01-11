'use strict';
require.config({
    shim: {
        qwest: {
            exports: 'qwest'
        }
    },
    packages: [
        { 'name': 'lodash', 'location': '../bower_components/lodash' }
    ],
    paths: {
        requirejs: "../bower_components/requirejs/require",
        'es6-promise': '../bower_components/es6-promise/promise',
        'qwest': '../bower_components/qwest/qwest.min'
    },
    baseUrl: 'app/'
});

require(
    ['mediator', 'storage', 'todos', 'add-form', 'search'],
    function (mediator, LongStorage, Todos, AddForm, Search) {
        var todos = new Todos('todos', mediator);
        todos.init();
        var storage = new LongStorage(mediator, window.localStorage);
        storage.getAll('todos');
        mediator.subscribe('todosUpdate', {context: storage, fn: function(array) {
            this.write('todos', array);
        }});
        todos.render();
        var addForm = new AddForm('add-form', mediator);
        addForm.init();

        var search = new Search('search-form', mediator);
        search.init();

    }
);

