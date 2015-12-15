/**
 * Created by dmitriy on 14.12.15.
 */
// List of all test dependencies
require.config({
    paths: {
        "material-design-lite": "../bower_components/material-design-lite/material.min",
        "mocha": "../bower_components/mocha/mocha",
        "chai": "../bower_components/chai/chai",
        "sinon": "../bower_components/sinon/lib/sinon",
        "mediator": "../app/mediator",
        "storage" : "../app/storage",
        "add-form": "../app/add-form",
        "todos" : "../app/todos"
    },
    shim: {
        "mocha": {
            exports: "mocha"
        },
        "chai": {
            exports: "chai"
        },
        "sinon": {
            exports: "sinon"
        },
        "material-design-lite": {
            exports: 'componentHandler'
        }
    },
    baseUrl: '/'
});
require([
    'test/mochaSetup', 'test/list_of_tests'
], function(mocha, tests) {
    require( tests, function() {
        if (window.mochaPhantomJS) {
            mochaPhantomJS.run();
        } else {
            // Start mocha
            mocha.run();
        }
    });
});