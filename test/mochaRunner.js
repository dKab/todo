/**
 * Created by dmitriy on 14.12.15.
 */
// List of all test dependencies
require([
    'test/todos'
], function() {
    if (window.mochaPhantomJS) {
        mochaPhantomJS.run();
    } else {
        // Start mocha
        mocha.run();
    }
});