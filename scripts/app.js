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
    baseUrl: 'scripts/',
    packages: []
});

require(
    ['mediator', 'todos', 'add-form'],
    function (mediator, Todos, AddForm) {

        var todos = new Todos('todos');
        todos.render();



        var addForm = new AddForm();

    }
);

