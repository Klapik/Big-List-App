# BigListApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.1.

## What is this repository for?

- Firestore database + Algolia search engine
- Virtual/infinity scroll
- 1.0.0

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Features

- Lazy loading modules
- Infinity scroll
- Virtual scroll
- Basic firebase functions connected with Algolia (create/remove document)
- Loading spinner
- Search input

## Project structure

```
dist/ compiled version
docs/ project docs and coding guides
e2e/ end-to-end tests
src/ project source code
|- app/ app components
| |- modules/ app modules
| | |-home/ main module
| | | |-components/ loading-spinner and search components
| | | |-pages |-home/ main page of the application 
| |- services/ app services
| | |-document / service for managing documents in firebase
| | |-search / service for fetching data from algolia
| |- app.component.* app root component (shell)
| |- app.module.ts app root module definition
| +- ... additional modules and components
|- assets/ app assets (cursor)
|- environments/ values for various build environments
|- index.html html entry point
|- styles.scss global style entry point
|- main.ts app entry point
|- polyfills.ts polyfills needed by Angular
+- test.ts unit tests entry point
```

## Customization

- To change project name you need to update `angular.json` and `package.json` files.
- To start the project, enter the keys in enviroments and configure algolia (indexes)

### Who do I talk to?

- klapii96@gmail.com

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

