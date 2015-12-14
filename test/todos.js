/**
 * Created by dmitriy on 14.12.15.
 */

/*
 * This file should be named sample.spec.js, but why?
 * General convention for test files is that they have the same name as the file
 * you are testing appended by an extra .spec extension.
 */

define(
    function () {
        describe('basic tests', function() {
            before(function() {
                this.targetElementId = 'test-container';
            });

            beforeEach(function() {
                var body = document.body;
                var container = this.container = document.createElement('div');
                container.setAttribute('id', this.targetElementId);
                body.appendChild(container);

            });

            afterEach(function() {
                document.body.removeChild(document.getElementById(this.targetElementId));
            });

            it('there should be a container', function() {
                this.container.tagName.should.equal('DIV');
            });
        });
    });