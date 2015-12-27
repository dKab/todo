/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(function () {

    /**
     * @param mediator
     * @param storage - the storage can be any storage as long as it implements methods getItem(key) & setItem(key, val)
     * @constructor
     */
    function Storage(mediator, storage) {
        this.mediator = mediator;
        this.storage = storage;
    }

    Storage.prototype.getAll = function(name) {
        var raw = this.storage.getItem(name),
            val;
            if (typeof raw === 'string') {
                try {
                    val = JSON.parse(raw);
                } catch(err) {
                    val = raw; //if it's not a valid json, than it's just a string
                }
            } else {
                val = raw;
            }
        if (val) {
            this.mediator.publish(name + 'Available', val);
        }
    };

    Storage.prototype.write = function(name, value) {
        if (this.storage === window.localStorage) {
            value = JSON.stringify(value);
        }
        this.storage.setItem(name, value);
    };

    return Storage;
});