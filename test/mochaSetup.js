/**
 * Created by Dmitry_Kabardinov on 12/15/2015.
 */
'use strict';
define(['mocha', 'chai'], function (mocha, chai) {

    mocha.setup('tdd'); //mode
    window.assert = chai.assert;

    return mocha;
});