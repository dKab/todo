/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(['mediator'], function (mediator) {
    var storage = {},
        ls = window.localStorage;

    //mediator.subscribe()

    storage.getAll = function() {
        var json = ls.getItem('todos'),
            todos = json ? JSON.parse(json) : [{id: 1423, text: 'fdsgfdgfdsgfdsg'}];
        mediator.publish('todosAvailable', todos);
    };

    storage.write = function(todos) {
        ls.setItem('todos', todos);
    };

    return storage;
});