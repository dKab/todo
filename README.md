##Prerequirements
You should have nodejs module **http-server** installed globally. You can install it with `npm install http-server -g`
Also you need **grunt-cli** to be installed globally on your machine.
After clonning the repository, install all dependencies with `npm install` and `bower install`.

Run `http-server` from project's root directory to start the server.
After that you can go to http://localhost:8080 in your browser to see application in action.

#Testing:
This setup allows to run test in browser as well as in command line with phantomJS
###PhantomJS
To run test in command line using phantomJS headless browser use `grunt mocha` command from project's root
###Normal Browser
To run test in a normal browser just go to http://localhost:8080/test/

**Note that the server should be running in both cases**

**Sidenote**: To be able to unit test methods that interact with private variables inside closures (
e.g. Method `onCheck` in `app/todos.js` writes in private module state variable `todos`) I used technique described by
Philip Walton here: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/ 

In  our `test` version of `requirejs.config` we need to specify paths relative to `test` dir for all modules that we test, or that may be
dependencies of modules being tested.


#Deployment:

To build optimized, ready (well not complitely ready - I basically don't do anything with my css, it's easy to add on any postcss later.
Just register whatever other tasks you need to proccess css/js and add them to the `build` task array) for deployment application 
just run `grunt build`. It will first strip all the testing code (see above) from source files and then process them with require.js
optimization tool - r.js with handy `grunt-contrib-requirejs` plugin. 
Note: if you use `grunt-contrib-requirejs` you don't need build.js - you can specify all necessary build options which you would put into `build.js`
in `Gruntfile.js` under `requirejs.compile.options`.

Deployment-ready code goes into `dist` directory and you can access it in your broswer by going to http://localhost:8080/dist/
(assuming you started web-server in app directory)

Enjoy!
