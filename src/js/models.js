'use strict';

var convert = require('../../lib/src/convert');

var Backbone = require('backbone')
  , _ = require('underscore');


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


/**
 * History of formulas.
 * Persistently stored in LocalStorage.
 */
exports.History = Backbone.Collection.extend({
  model: exports.Converter,

  localStorage: new Backbone.LocalStorage('history'),

  // While individual converters can be stored out of order,
  //   the entire collection grows only on one of its ends.
  // Thus, if one element is added after another, then it is
  //   guaranteed that it is located above in the history stack.
  // This insertion order is mirrored by this variable.
  // Its domain is negative to avoid collisions with existing IDs.
  nextId: -1,

  initialize: function () {
    // These lines rely on the synchrony of LocalStorage.
    this.once('sync', this.renumerate, this);
    this.fetch();
  },

  // Item IDs will constantly increase over time,
  //   so it is necessary to renumerate them on sync.
  // But the most important reason to do it is to normalize IDs
  //   to keep them non-negative for further insertions.
  renumerate: function () {
    this.reset(_.chain(this.models)
                .sortBy('id')
                .each(function (model) {
                  model.sync('delete', model);
                })
                .value());
    this.each(function (model, index) {
      model.save('id', index);
    });
  }
});
