[![Build Status](https://travis-ci.org/dKab/todo.svg?branch=master)](https://travis-ci.org/dKab/todo)
##Dependencies
If you want to run start this project on your machine make sure you have **karma-cli** installed globally.
You can install it with `npm i karma-cli -g`.
Also you need **grunt-cli** to be installed (also globally) on your machine.
After clonning the repository, install all dependencies with `npm install` and `bower install`.

#Development
Run `grunt dev` to start karma server. Karma will track changes in source files and run tests.
To see project in browser you need to have http server up and running.
To start http server run `grunt server`. After that you can see the project at http://localhost:8080


**Sidenote**: To be able to unit test methods that interact with private variables inside closures (
e.g. Method `onCheck` in `app/todos.js` writes in private module state variable `todos`) I used technique described by
Philip Walton here: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/ 

#Deployment
To build optimized, ready for deployment application just run `grunt build`.
Note: if you use `grunt-contrib-requirejs` you don't need build.js - you can specify all necessary build options which you would otherwise put into `build.js` in `Gruntfile.js` under `requirejs.compile.options`.

Deployment-ready code goes into `dist` directory and you can access it in your broswer at http://localhost:8080/dist/

Enjoy!
