/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(function () {

    var channels = {};

    /*test-code*/
    window.testing = window.testing || {};
    window.testing._mediatorChannels = channels;
    /*end-test-code*/

    function subscribe(channel, subscriber) {
        if (channels[channel]) {
            channels[channel].push(subscriber);
        } else {
            channels[channel] = [subscriber];
        }
    }

    function publish(channel) {
        var args = Array.prototype.slice.call(arguments, 1),
            subscribers = channels[channel],
            subscriber;
        if (typeof subscribers !== 'undefined') {
            subscribers.forEach(function(subscriber) {
                subscriber.fn.apply(subscriber.context, args);
            });
        }
    }

    return {
        subscribe: subscribe,
        publish: publish
    };
});