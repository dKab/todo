'use strict';
require.config({
    shim: {
        "material-design-lite": {
            exports: 'componentHandler'
        },
        qwest: {
            exports: 'qwest'
        }
    },
    packages: [
        { 'name': 'lodash', 'location': '../bower_components/lodash' }
    ],
    paths: {
        "material-design-lite": "../bower_components/material-design-lite/material",
        requirejs: "../bower_components/requirejs/require",
        'es6-promise': '../bower_components/es6-promise/promise',
        'qwest': '../bower_components/qwest/qwest'
    },
    baseUrl: 'app/'
});

require(
    ['material-design-lite', 'mediator', 'storage', 'todos', 'add-form', 'search'],
    function (componentHandler, mediator, LongStorage, Todos, AddForm, Search) {
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
    //TODO add load screen on xhr
);

