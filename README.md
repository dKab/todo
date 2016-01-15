[![Build Status](https://travis-ci.org/dKab/todo.svg?branch=master)](https://travis-ci.org/dKab/todo)
##Dependencies
You should have nodejs module **http-server** installed globally. You can install it with `npm install http-server -g`
Also you need **grunt-cli** to be installed globally on your machine.
After clonning the repository, install all dependencies with `npm install` and `bower install`.

#Development
Run `grunt dev` to start http-server listening 8080 port and setup watcher for js source files.
It will run unit tests on each file save.
After that you can go to http://localhost:8080 in your browser to see application in action.

#Testing:
This setup allows to run test in browser as well as in command line with phantomJS
###PhantomJS
To run test in command line using phantomJS headless browser use `grunt mocha` command from project's root
###Normal Browser
To run test in a normal browser just go to http://localhost:8080/test/ (http server should be running.
You can start it manually with `http-server` command from project's root directory)

**Note that the server should be running in both cases**

**Sidenote**: To be able to unit test methods that interact with private variables inside closures (
e.g. Method `onCheck` in `app/todos.js` writes in private module state variable `todos`) I used technique described by
Philip Walton here: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/ 

In  our `test` version of `requirejs.config` we need to specify paths relative to `test` dir for all modules that we test, or that may be
dependencies of modules being tested.


#Deployment:

To build optimized, ready for deployment application just run `grunt build`.
Note: if you use `grunt-contrib-requirejs` you don't need build.js - you can specify all necessary build options which you would otherwise put into `build.js` in `Gruntfile.js` under `requirejs.compile.options`.

Deployment-ready code goes into `dist` directory and you can access it in your broswer by going to http://localhost:8080/dist/

Enjoy!
