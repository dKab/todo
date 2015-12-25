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
    ['mediator', 'storage', 'todos', 'add-form'],
    function (mediator, storage, Todos, AddForm) {
        var todos = new Todos('todos', mediator);
        storage.getAll();
        todos.render();
        //
        //
        //
        //var addForm = new AddForm();

    }
);

