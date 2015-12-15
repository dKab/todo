##Prerequirements
You should have nodejs module **http-server** installed globally. You can install it with `npm install http-server -g`
Also you need **grunt-cli** to be installed globally on your machine.
After clonning the repository, install all dependencies with `npm install` and `bower install`.

Run `http-server app` from project's root directory to start the server.
After that you can go to http://localhost:8080 in your browser to see application in action.

#Testing:
This setup allows to run test in browser as well as in command line with phantomJS
###PhantomJS
To run test in command line using phantomJS headless browser use `grunt mocha` command from project's root
###Normal Browser
To run test in a normal browser just go to http://localhost:8080/test/

**Note that the server should be running in both cases**

Enjoy!
