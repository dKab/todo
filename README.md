[![Build Status](https://travis-ci.org/dKab/todo.svg?branch=master)](https://travis-ci.org/dKab/todo)

Simple todo app written in Javascript just for the sake of learning without any heavy framework.

##Dependencies
If you want to run this project on your machine make sure you have **karma-cli** installed globally (you can install it with `npm i karma-cli -g`).
Also you need **grunt-cli** (installed also globally).
After clonning the repository, install all the dependencies with `npm install`.

#Development
Run `npm start` and you are good to go!
It weill start karma server (which will watch source files for changes and run tests) and http sever listening to 8080 port.
After that you can see the project at http://localhost:8080


**Sidenote**: To be able to unit test methods that interact with private variables inside closures (
e.g. Method `onCheck` in `app/todos.js` writes in private module state variable `todos`) I used technique described by
Philip Walton here: http://philipwalton.com/articles/how-to-unit-test-private-functions-in-javascript/ 

#Deployment
To build ready for deployment application, run `npm run build`.
It will put optimized app into `dist` directory and you can access it in your broswer at http://localhost:8080/dist/

Enjoy!
