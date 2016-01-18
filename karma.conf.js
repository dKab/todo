module.exports = function (config) {
    'use strict';
    config.set({

        basePath: '',

        frameworks: ['mocha'],

        files: [
            'bower_components/Element.closest/closest.js',
            'bower_components/requirejs/require.js',
            'node_modules/karma-requirejs/lib/adapter.js',
            {pattern: 'bower_components/**/*.js', included: false},
            {pattern: 'app/*.js', included: false},
            {pattern: 'test/tests/*.js', included: false},
            'test/test-main.js',
            {pattern: 'templates/*.html', included: false, served: true, nocache: false}
        ],
        exclude: [
            'app.js'
        ],

        proxies: {
            "/templates/": "/base/templates/"
        },

        client: {
            mocha: {
                ui: 'tdd'
            }
        },
        reporters: ['progress'],

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['PhantomJS']

    });
};