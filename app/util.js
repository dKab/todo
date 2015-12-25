/**
 * Created by dmitriy on 24.12.15.
 */
define(['qwest'], function (ajax) {
    return {
        loadTemplate: function( name ) {
            if ( !this._cache[ name ] ) {
                this._cache[ name ] = ajax.get('/templates/' + name);
            }
            return this._cache[ name ];
        },
        _cache: {}
    };
});