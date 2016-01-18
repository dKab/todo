/**
 * Created by dmitriy on 27.12.15.
 */
define(
    ['sinon', 'storage', 'chai'],
    function (sinon, LongStorage, chai) {

        suite('Storage module', function () {

            var fakeMediator = {
                publish: function() {}
            },
                assert = chai.assert;

            test('constructor', function() {
                var storage = new LongStorage(fakeMediator, {});
                assert(storage);
            });

            test('getAll method', function() {
                var spy = sinon.spy();
                var storage = new LongStorage(fakeMediator, {getItem: spy});
                storage.getAll('todos');
                assert(spy.calledOnce, 'calls getItem method of internal storage');
                assert(spy.calledWith('todos'));
            });

            test('getAll method publishes to the corresponding channel', function() {
                var stub = sinon.stub();
                var todos = ['eat', 'sleep', 'code'],
                    bears = ['polar', 'panda', 'grizzly'];
                stub.withArgs('todos').returns(todos);
                stub.withArgs('bears').returns(bears);
                var spy = sinon.spy();
                var storage = new LongStorage({publish: spy}, {getItem: stub});
                storage.getAll('todos');
                storage.getAll('bears');
                assert(spy.getCall(0).calledWith('todosAvailable', todos));
                assert(spy.getCall(1).calledWith('bearsAvailable', bears));
            });

            test('write method calls setItem method of internal storage object', function() {
                var spy = sinon.spy();
                var storage = new LongStorage({}, {setItem: spy});
                var todos = ['do nothing'],
                    drinks = ['bear', 'soy milk'];
                storage.write('todos', todos);
                storage.write('drinks', drinks);
                assert(spy.getCall(0).calledWith('todos', todos));
                assert(spy.getCall(1).calledWith('drinks', drinks));
            });

        });
    });