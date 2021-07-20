# Node and React Code Coverage Using Cypress

This sample application was created with a Node backend using Express framework, and a React.js frontend. It shows a mock API where the user can click and make a /get request to the backend.

The main objective was to get fullstack code coverage using [Cypress](https://www.cypress.io) testing framework for a React and Node backend in a simple way for understanding.

Clone the repo and to start:

`npm install` in the root directory, ./frontend/ folder and ./backend/ folder

In the root directory, instrument the frontend using:

`npx nyc instrument --compact=false frontend/src instrumented`

Instrumentation of the backend is handled with the script: 

```
"start": "nyc --silent node index.js"`
```
Make sure nyc is installed as a dev dependency in backend and root directories (if not, run `npm install nyc --save-dev` in backend or root directory)

Cd into backend and start server with:

`npm start`

Open another terminal, cd into frontend and run:

`npm start`

In the root directory, start Cypress:

`npm test`

In `cypress/integration`, create a `test.spec.js` file and add:

```
describe('functional test 1', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('click on button', () => {
        cy.get(<replace this with a selector of a button in quotes>).click()
    })
})
```

Once Cypress is open, click the `test.spec.js` and a simple functional test should run in its built-in browser. 

A coverage folder should be automatically created and code coverage should be saved in `coverage/lcov-report/index.html`. Open the index.html file in browser and both backend and frontend code coverage should be viewable!

________________________________________________________________________________

## Guide for quick fullstack code coverage

NOTE: This guide is specific for the project above. Small changes should be made in your project since this is specific for this project with Express-Node and React. See docs for more info: [https://docs.cypress.io/guides/tooling/code-coverage]

Overview: In order to get code coverage, we need to have a test framework (ie Selenium or Cypress) installed with test files. Cypress is recommended for ease of use with JS projects. The code needs to be instrumented, and here I'm using Istanbul with NYC but other tools can be used for instrumentation and configuration. Here, I recreated an open source project to use for testing and review.

For an exmaple, clone these two repos into a root directory (open source):
https://github.com/techomoro/SimpleExpressBackend.git
https://github.com/techomoro/SimpleReactFrontend.git

In the root directory of your project where package.json is (run `npm init` if haven't already), install Cypress using:

`npm install cypress --save-dev`

Run Cypress either with:
`npx cypress open`

or create a script in package.json such as:

```
"scripts": { "test": "cypress open" } `
```

then run: 
`npm run test`

This will create the associated files for Cypress including the cypress folder where tests are held and a cypress.json config file. It will also run in the background on node terminal. Tests can be run by clicking spec.js files in the Cypress window. 

In the `cypress/integration` folder, you can find example test files that can be run separately as examples. 
For an example in this project, create a sample `test.spec.js` file in the integration folder and input:

```
describe('functional test 1', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })

    it('click on button', () => {
        cy.get(<replace this with a selector of a button in quotes>).click()
    })
})
```

### Grab Code Coverage with this plugin

In the root of your project, install the code coverage Cypress plugin. This will grab the instrumented code coverage object (`window.__coverage__`) in the window of the DOM. Run:

`npm install -D @cypress/code-coverage`

Go to `cypress/support/index.js` and add:

```
import '@cypress/code-coverage/support'
```

Go to `cypress/plugins/index.js` file, and register tasks by replacing `module.exports` with:

```
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config)

  // add other tasks to be registered here

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config
}
```

More info here: [https://github.com/cypress-io/code-coverage]

### Instrumentation

Now we have to instrument the code and it's recommended to use [Istanbul](https://istanbul.js.org) with NYC command-line-client or Babel with Istanbul. Here, during our tests Istanbul will increment each line of code and record which lines of code were executed or not during our tests and show it in a `window.__coverage__` object on the DOM. We have to grab the `window.__coverage__` object and show it in a human-readable format.

FRONTEND:

NOTE: For apps with react-scripts, this helper npm module instruments code coverage on the fly, using nyc and Istanbul. Instrumentation can also be done with a configuration file such as .nycrc, gruntfile.js, .babelrc, or any similar option, however, it was beyond the scope of the objective and there aren't many docs on this. 
More info here: [https://github.com/cypress-io/instrument-cra]

In frontend directory, run:

`npm install @cypress/instrument-cra`

Change `npm start` script to:

```
{
  "scripts": {
    "start": "react-scripts -r @cypress/instrument-cra start"
  }
}
```

In the root directory, run:

`npm install --save-dev nyc`

To instrument code for frontend in a readable format, run:

`npx nyc instrument --compact=false SimpleReactFrontend/src instrumented` (Replace `SimpleReactFrontend/src` with the appropriate src/ folder for your frontend)

Run:

`npm start`

BACKEND:

In the backend folder, run:

`npm install --save-dev nyc`

To easily instrument backend code, in backend's `package.json` file add this before your server script:

`nyc --silent node src/server.js`

In this example:

```
  "scripts": {
    "start": "nyc --silent node index.js"
  }
```

For Express, in your server port file, add:

```
const express = require('express')
const app = express()
require('@cypress/code-coverage/middleware/express')(app)
```

*** more endpoints can be found here: [https://github.com/cypress-io/code-coverage]

In `cypress.json`, add:

```
{
  "env": {
    "codeCoverage": {
      "url": "http://localhost:3000/__coverage__"
    }
  }
}
```

Now run the server and your backend code should be instrumented and the `.nyc_output` file created in the backend:

`npm  start`

In the root of your project, open Cypress:

`npm run open cypress`

After running the tests, the code coverage report should be generated in the `coverage/lcov-report/index.html` file. Open it in browser and you should see both backend and frontend code coverage reports!

