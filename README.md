# socialmedia

* `$ git clone https://github.com/sorin-davidoi/socialmedia.git`
* `$ cd socialmedia`
* `$ npm install`
* `$ bower install`
* `$ node app.js`

Start with `$ node app.js`.

In order to ease deployment and to provide some default dummy data, I have deployed a mongoDB instance online and configured the application to connect to it. The alternative would have been to dump the database and provide instruction to restore it, or use a sort of mongoose plugin to import data when the application starts. If for some reason the server is down, please replace the address and the port in [line 19 of setup.js](https://github.com/sorin-davidoi/socialmedia/blob/master/setup.js#L19) with ```localhost``` (there will not be any dummy data, but it should work, provided that mongoDB is running).

## Backend

For the backend, I chose to use mongoDB with [mongoose](mongoosejs.com). I have created three document models: `Item`, `Channel`, and `Geo` (the same model is shared between `Country`, `Region`, `City` and `Language`). `Item` contains references to the other objects, similar to foreign keys in relational databases.

In order to expose these objects easily via REST, I chose to use [express-restify-mongoose](https://florianholzapfel.github.io/express-restify-mongoose/). This package takes a mongoose model and creates a REST interface for it. For example, the API for `Item` is:

* `GET /api/v1/items/count`
* `GET /api/v1/items`
* `PUT /api/v1/items`
* `POST /api/v1/items`
* `DELETE /api/v1/items`


* `GET /api/v1/items/:id`
* `GET /api/v1/items/:id/shallow`
* `PUT /api/v1/items/:id`
* `POST /api/v1/items/:id`
* `DELETE /api/v1/items/:id`

Another convenient thing with this package is that it also exposes the mongoDB query API, so server-side filtering is just a matter of passing the right parameters. Moreover, we can also use it to populate the documents, which is necessary since `Item` contains references to other documents.

## Frontend

Implemented features:
* CRUD operations for `item`
* Visualizing the items in a calendar
* Use [socket.io](socket.io) to sync the database changes with the calendar
* Searching by `content.message`

The application is split into four modules (`SocialMedia`, `SocialMedia.Core`, `SocialMedia.Calendar` and `SocialMedia.Publish`), in order to make is easier to identify the main features and to and visualize dependencies. All interactions with the backend API take place in factories, which are then injected into the controllers. Since we are working with a REST API, I chose to use `$resource` manipulate the data.

I have tried to further reduce the dependencies between controllers and data by fetching the data when routing, by resolving the promises using the `resolve` property of `$routeProvider`. This way, the controllers would have received the fetched data, and would not have had to interact directly with `$resource`. However, this causes the promises to be resolved before the actual page is even fetched, so we do not have the possibility to display a loading indicator. The users could have the impressing that the page was hanging, so I have decided to move the data fetching back into the controllers and to display a loading indicator.

### SocialMedia.Core

Here we create the factories for each of the database models. In addition, the `syncer` factory provided synchronization between the calendar and the server via `socket.io`.

### SocialMedia.Publish

We use the `sm-publish` directive to provide functionality for creating, editing and deleting items. This directive makes use of two other directives:

* `sm-edit` - basically a form for creating and editing an item; supports image upload on the server (note: the image is uploaded on the server, in `public/images`, and not to the database; `content.media.fileUrl` will then point to that file on `localhost`)
* `sm-view` - provides preview for the item being edited. Its role is to provide instant feedback on how the item will look once published, depending on the social network used

`sm-publish` acts as a glue between these two directives: it passes the same object to both of them and makes sure `sm-edit` gets the data it needs (the list of channels, countries...).

After an event is created or updated, the user is redirected to the item's page, allowing it to quickly share a direct link to it.

### SocialMedia.Calendar

I have decided to use an Angular wraper for [Arshaw FullCalendar](http://arshaw.com/fullcalendar/) called [UI Calendar](http://angular-ui.github.io/ui-calendar/). When the page loads, we fetch the initial data from the server (we perform server-side filtering, fetching just the data we need). We then set up `socket.io` to monitor changes for the data-range we are displaying. As `sm-calendar` is just for displaying the data and handling user interactions, the code that handles the synchronization between the fetched items and the server resides in the `syncer` factory. The syncing protocol is as follows:

|  W - number of the week |  M - number of the month |
|------------------------ | -------------------------|
|    `item:week:W:new`    |   `item:month:M:new`     |
|    `item:week:W:edit`   |   `item:month:M:edit`    |
|   `item:week:W:delete`  |   `item:month:M:delete`  |

The design of the protocol reflects the nature of the calendar: it can display events from a week or from a month.

`syncer` takes care of handing the changes and informs the calendar when a new render of the events is needed.

The calendar makes sure to subscribe and unsubscribe for changes when the user changes the view (from month to week or between the same date ranges).

On the backend side, I wrote hooks for 'post' database events, where the corresponding signals are emitted.

While `Ui Calendar` provides nice Angular integration, the fact that `FullCalendar` relies heavily on `jQuery` creates some difficulties. For instance, if we want to render the events ourselves (as I have done for the `week` view) by using a directive, we need to compile the directive ourselves since the event rendering happens outside of Angular's lifecycle.

Clicking on an event opens a modal dialog for a quick preview, from when the user can proceed to the item's page or can start to edit it.

Basic filtering of the displayed events is provided via two dropdowns: filtering by network and channels. The filtering is client-side, and only affects the events in the current view. This is also handled by `syncer`. Server-side filtering is provided by the search functionality.

Navigating from one view to another changes the URL of the page without reloading the controller. This allows the user to share a direct link to the items published at a specific date.

### Search

A search bar is located in the header, allowing for filtering item by the content of their message. Here, the URL also changes to reflect the search terms. The filtering here is server-side, and not in any way related to the filter implemented in the calendar.

## Routing overview

Thanks to the modularity provided by directives, we are able to resolve three routes using one directive.

  Route                        |   Directive
------------------------------ | -------------
          `/publish`           | `sm-publish`
          `/view/:id`          | `sm-publish`
          `/edit/:id`          | `sm-publish`
`/calendar/:year/:month:/:day` | `sm-calendar`
          `/search`            | `sm-search`

## Tests

I have used [Protractor](https://angular.github.io/protractor/#/) to write end-to-end tests, which can be found in the `test/client` directory and can be executed with `gulp test-client`. While they do not replace the need for unit-testing, they have helped me a lot making sure no regressions slip in when refactoring.

I decided to test the most delicate part of the application: synching items via `socket.io`. There are only three tests, but they imply creating, editing and deleting items, which are also tested by extent.

What have I tested:
* Calendar should sync via socket.io when a new item is created
* Calendar should sync via socket.io when a new item is updated
* Calendar should sync via socket.io when a new item is deleted

## Misc

I have tried to follow the best-practice guides regarding AngularJS and JavaScript, some of which are:
* All components are wrapped in `Immediately Invoked Function Expression`, to avoid variable collisions and polluting the global scope
* Folders-by-feature structure
* One component per file
* Fix all warning issued by [ESLint](http://eslint.org/) using the [angular plugin](https://www.npmjs.com/package/eslint-plugin-angular)

All the pages are responsive, with the exception of the calendar, which is non trivial to implement (should hide content based on the resolution).

## Things I did not address:
* CSS and JavaScript concatenation and minification - while I have set up a framework for this for [pomodorojs-angular](https://github.com/sorin-davidoi/pomodorojs-angular/blob/master/gulpfile.js) using gulp, I am not exactly sure how to apply it if the files are served via a web-server.
* browser compatibility - I have developed against the latest version of Chromium on Linux (Version 46.0.2490.86 (64-bit)), and ran the e2e tests using against the same configuration.
* looked into code coverage (it seems a bit tricky to set up Protractor for this, not as easy as using `istanbul` with `mocha` and `gulp` for backend testing)
* profiling the application
* error handling - for now, they are printed in the console using `$log`
* backend testing - considering that most of the heavy work is done by `express-restify-mongoose`, I did not write any kind of tests (although the server and the database connection is tested indirectly by the end-to-end tests; the same goes for the `socket.io` code). express-restify-mongoose has a code coverage of [97%](https://coveralls.io/github/florianholzapfel/express-restify-mongoose?branch=master), is under active development and is build on established technologies, which leads me to believe that the implementation is quite solid.
* automation - setting up a complex build system

## Documentation and comments

All modules, factories, directives and routes have at least a short description and the meaning of their parameters. Unintuitive, or complex, pieces of code are accompanied by comments.

The documentation can is located at `docs/index.html`, and can be generated using `gulp docs`.

## Credits

The images used as dummy data are taken from:
* https://www.flickr.com/photos/inspirekelly/9827093964/
* https://www.flickr.com/photos/zachinglis/5507648594/
* https://www.flickr.com/photos/75487768@N04/16120452980/
* https://www.flickr.com/photos/dmitry-baranovskiy/2378867408
* https://www.flickr.com/photos/landfeldt/2400107273
* https://www.flickr.com/photos/soundsasimages/6086788031/

## License

GNU General Public License v3.0
