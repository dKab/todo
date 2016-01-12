/**
 * Created by dmitriy on 24.12.15.
 */
define(['qwest'], function (ajax) {
    return {
        loadTemplate: function( name ) {
            if ( !this._cache[ name ] ) {
                //this is required because github pages add name of repo to the url
                var path = location.pathname === '/todo/' ? 'templates/' : '/templates/';
                this._cache[ name ] = ajax.get(path + name);
            }
            return this._cache[ name ];
        },
        _cache: {}
    };
});