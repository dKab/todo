/**
 * Created by dmitriy on 14.12.15.
 */
// List of all test dependencies
require.config({
    paths: {
        'material-design-lite': '../bower_components/material-design-lite/material',
        'mocha': '../bower_components/mocha/mocha',
        'chai': '../bower_components/chai/chai',
        'sinon': '../bower_components/sinon/lib/sinon',
        'es6-promise': '../bower_components/es6-promise/promise',
        'qwest': '../bower_components/qwest/qwest',
        'mediator': '../app/mediator',
        'storage' : '../app/storage',
        'add-form': '../app/add-form',
        'todos' : '../app/todos',
        'util': '../app/util',
        'search': '../app/search'
    },
    shim: {
        'mocha': {
            exports: 'mocha'
        },
        'chai': {
            exports: 'chai'
        },
        'sinon': {
            exports: 'sinon'
        },
        'material-design-lite': {
            exports: 'componentHandler'
        },
        qwest: {
            exports: 'qwest'
        }
    },
    baseUrl: '/',
    packages: [
        { 'name': 'lodash', 'location': '../bower_components/lodash' }
    ]
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