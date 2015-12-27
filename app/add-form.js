/**
 * Created by Dmitry_Kabardinov on 12/14/2015.
 */
'use strict';
define(
    ['mediator', 'lodash/string/trim'],
    function (mediator, trim) {


        function AddForm(id, mediator) {
            this.elem = document.getElementById(id);
            this.mediator = mediator;
        }

        AddForm.prototype.init = function() {
            var self = this;
            //TODO how to test it?
            this.elem.addEventListener('keyup', function(e) {
                if (e.keyCode == 13) {
                    self.add();
                }
            });
            this.elem.addEventListener('click', function(e) {
                if (~e.target.className.indexOf('add-form__btn-js')) {
                    self.add();
                }
            })
        };

        AddForm.prototype.add = function () {
            //get value of input elem
            var input = this.elem.querySelector('input[type=text]');
            var text = trim(input.value);
            if (text) {
                this.mediator.publish('newTodo', text);
                input.value = '';
                input.focus();
            }
        };


    return AddForm;
});