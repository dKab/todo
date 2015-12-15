/**
 * Created by dmitriy on 14.12.15.
 */
// List of all test dependencies
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