'use strict';
require.config({
    shim: {
        "material-design-lite": {
            exports: 'componentHandler'
        }
    },
    paths: {
        "material-design-lite": "../bower_components/material-design-lite/material.min",
        requirejs: "../bower_components/requirejs/require"
    },
    baseUrl: '/',
    packages: []
});

require(
    ['mediator', 'storage', 'todos', 'add-form'],
    function (mediator, storage, Todos, AddForm) {
        var todos = new Todos('todos');
        storage.getAll();
        todos.render();
        //
        //
        //
        //var addForm = new AddForm();

    }
);

