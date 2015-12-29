/**
 * Created by dmitriy on 28.12.15.
 */
define(
    ['search', 'sinon'],
    function (Search, sinon) {
    suite('search module', function() {

        var containerId = 'search-form',
            _filteringPredicate = window.testing._filterPredicate,
            searchInput;

        setup(function() {
            var searchContainerElem = document.createElement('div');
            searchContainerElem.id = containerId;
            searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchContainerElem.appendChild(searchInput);
            document.body.appendChild(searchContainerElem);
        });

        teardown(function() {
            document.body.removeChild(document.getElementById(containerId));
        });

        test('constructor', function() {
            var search = new Search(containerId, {});
            assert.isObject(search);
        });

        test('notify', function() {
            var mediator = {
                publish: sinon.spy()
            };
            var search = new Search(containerId, mediator);
            search.notify();
            assert(mediator.publish.calledWith('filterUpdate', _filteringPredicate));
        });


        test('clear', function() {
            var search = new Search(containerId, {});
            search.notify = sinon.spy();
            _filteringPredicate.text = 'some string';
            searchInput.value = 'some string';
            search.clear();
            assert.equal(_filteringPredicate.text, '');
            assert.equal(searchInput.value, '');
            assert(search.notify.called);
        });

        test('updatePredicate', function() {
            var event = {
                target: searchInput
            };
            var search = new Search(containerId ,{});
            search.notify = sinon.spy();
            searchInput.value = 'test test test';
            search.updatePredicate(event);
            assert.equal(_filteringPredicate.text, 'test test test');
            assert(search.notify.called);
            searchInput.value = 'more test';
            search.updatePredicate(event);
            assert.equal(_filteringPredicate.text, 'more test');
            assert(search.notify.calledTwice);
        });

        test('togglechecked', function() {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            var search = new Search(containerId, {});
            search.elem.appendChild(checkbox);
            search.notify = sinon.spy();

            checkbox.checked = false;
            assert(_filteringPredicate.checked);
            search.togglechecked({target: checkbox});
            assert.isTrue(_filteringPredicate.checked);
            checkbox.checked = true;
            search.togglechecked({target: checkbox});
            assert.isFalse(_filteringPredicate.checked);
            assert(search.notify.calledTwice);
        });

    });
});