/**
 * Created by dmitriy on 27.12.15.
 */
define(
    function () {

        function Search(id, mediator) {
            this.elem = document.getElementById(id);
            this.mediator = mediator;
        }

        var filterPredicate = {
            text: '',
            checked: true
        };

        /*test-code*/
        window.testing = window.testing || {};
        window.testing._filterPredicate = filterPredicate;
        /*end-test-code*/

        Search.prototype.updatePredicate = function(e) {
            var input = this.elem.querySelector('input[type=text]');
            if (e.target === input) {
                filterPredicate.text = input.value;
                this.notify();
            }
        };


        Search.prototype.init = function() {
            this.elem.addEventListener('keyup', this.updatePredicate.bind(this));
            this.elem.addEventListener('change', this.togglechecked.bind(this));
        };

        Search.prototype.clear = function() {
            filterPredicate.text = '';
            this.elem.querySelector('input[type=text]').value = '';
            this.notify();
        };

        Search.prototype.togglechecked = function(e) {
            var checkbox = this.elem.querySelector('input[type=checkbox]');
            if (e.target === checkbox) {
                filterPredicate.checked = !checkbox.checked;
                this.notify();
            }
        };

        Search.prototype.notify = function() {
            this.mediator.publish('filterUpdate', filterPredicate);
        };

    return Search;

});