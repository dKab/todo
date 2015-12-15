/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(function () {

    var channels = {};

    function subscribe(channel, subscriber) {
        if (channels[channel]) {
            channels[channel].push(fn);
        } else {
            channels[channel] = [fn];
        }
    }

    function publish(channel, args) {
        var subscribers = channels[channel],
            subscriber;
        if (typeof subscribers !== 'undefined') {
            while (subscribers.length !== 0) {
                subscriber = subscribers.unshift();
                    subscriber.apply(subscriber.context, args);
            }
        }
    }

    return {
        subscribe: subscribe,
        publish: publish
    };
});