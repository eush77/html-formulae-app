'use strict';

var convert = require('../../lib/src/convert');

var Backbone = require('backbone');


/**
 * Converter holds a single input/output pair:
 * - input: string, input value;
 * - output(*): string, unwrapped HTML output.
 *
 * (*) - computed property.
 */
exports.Converter = Backbone.Model.extend({
  defaults: {
    input: ''
  },

  initialize: function () {
    this.on('change:input', this.setOutput, this);
  },

  setOutput: function () {
    this.set('output', this.convert(this.get('input')));
  },

  convert: function (input) {
    // Proxy to Convert module.
    return convert(input);
  }
});


/**
 * Theme descriptor:
 *  - name: string, unique theme identifier;
 *  - src: theme .css path;
 *  - icon: theme icon color.
 */
exports.Theme = Backbone.Model;


exports.Themes = Backbone.Collection.extend({
  model: exports.Theme
});


/**
 * Currently set theme.
 * Persistently stored in LocalStorage.
 */
exports.CurrentTheme = exports.Theme.extend({
  defaults: {
    // Fixed ID between sessions.
    id: 0
  },

  localStorage: new Backbone.LocalStorage('current-theme'),

  initialize: function () {
    this.fetch();
  }
});
