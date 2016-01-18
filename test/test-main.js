var tests = [];
for (var file in window.__karma__.files) {
    if (/spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/',

    paths: {
        'chai': '../bower_components/chai/chai',
        'sinon': '../bower_components/sinon/lib/sinon',
        'es6-promise': '../bower_components/es6-promise/promise',
        'qwest': '../bower_components/qwest/qwest.min'
    },
    packages: [
        { 'name': 'lodash', 'location': '../bower_components/lodash' }
    ],
    shim: {
        'chai': {
            exports: 'chai'
        },
        'sinon': {
            exports: 'sinon'
        },
        qwest: {
            exports: 'qwest'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});