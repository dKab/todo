/**
 * Created by dmitriy on 27.12.15.
 */
define(
    ['sinon', 'mediator', 'chai'],
    function (sinon, mediator, chai) {

        var _mediatorChannels = window.testing._mediatorChannels,
            assert = chai.assert;

        setup(function() {
            var _mediatorChannels = {};
        });

        suite('mediator module', function () {

            test('subscribe', function() {
                assert.isUndefined(_mediatorChannels.todosAvailable);
                mediator.subscribe('todosAvailable', {});
                assert.isArray(_mediatorChannels.todosAvailable);
                assert.equal(_mediatorChannels.todosAvailable.length, 1);
                mediator.subscribe('todosAvailable', 'subscriber');
                assert.equal(_mediatorChannels.todosAvailable.length, 2);
            });

            test('publish', function() {
                var firstSubscriberArgs = [],
                    secondSubscriberArgs = [],
                    firstSubscriberCallContext, secondSubscriberCallContext;
                var subscriber = {
                    doSmthg: function(a, b, c) {
                        firstSubscriberArgs.length = 0;
                        firstSubscriberArgs.push(a);
                        firstSubscriberArgs.push(b);
                        firstSubscriberArgs.push(c);
                        firstSubscriberCallContext = this;
                    }
                };
                var anotherSubscriber = {
                    context: window, fn: function(a) {
                        secondSubscriberArgs.length = 0;
                        secondSubscriberArgs.push(a);
                        secondSubscriberCallContext = this;
                    }
                };
                _mediatorChannels.someChannel = [
                    {context: subscriber, fn: subscriber.doSmthg },
                    {context: window, fn: anotherSubscriber.fn}
                ];
                var spy = sinon.spy(subscriber, "doSmthg"),
                    secondSpy = sinon.spy(anotherSubscriber, 'fn');
                assert.isFalse(spy.called);
                assert.isFalse(secondSpy.called);
                mediator.publish('someChannel', 'one', 'two', 'three');
                assert.equal(firstSubscriberArgs[0], 'one');
                assert.equal(firstSubscriberArgs[1], 'two');
                assert.equal(firstSubscriberArgs[2], 'three');
                assert.strictEqual(firstSubscriberCallContext, subscriber);
                assert.equal(secondSubscriberArgs[0], 'one');
                assert.strictEqual(secondSubscriberCallContext, window);

                mediator.publish('someChannel', 123);
                assert.equal(firstSubscriberArgs[0], 123);
                assert.isUndefined(firstSubscriberArgs[1]);
                assert.equal(secondSubscriberArgs[0], 123);
                assert.isUndefined(secondSubscriberArgs[1]);
            });

        });
    });