/**
 * Created by dmitriy on 14.12.15.
 */
define(
    function () {
        suite('todos module', function() {
            setup(function() {
                this.targetElementId = 'test-container';
                var body = document.body;
                var container = this.container = document.createElement('div');
                container.setAttribute('id', this.targetElementId);
                body.appendChild(container);
            });

            test('there should be a container', function() {
                assert.equal(this.container.tagName, 'DIV');
            });

            teardown(function() {
                document.body.removeChild(document.getElementById(this.targetElementId));
            });


        });
    });