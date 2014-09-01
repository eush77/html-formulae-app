'use strict';

// Populate Backbone with jQuery and LocalStorage.
require('backbone').$ = require('jquery');
require('backbone').LocalStorage = require('backbone.localstorage');

// Start the app.
var app = new (require('./views').AppView)();
app.render();
