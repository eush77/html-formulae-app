'use strict';

var Converter = require('./models').Converter
  , Themes = require('./models').Themes
  , Theme = require('./models').Theme
  , CurrentTheme = require('./models').CurrentTheme
  , themes = require('../themes.json');

var Backbone = require('backbone')
  , template = require('lodash.template');


var ConverterView = Backbone.View.extend({
  Model: Converter,

  initialize: function () {
    this.$preview = this.$('.preview>p');
    this.$source = this.$('.source>textarea');

    this.listenTo(this.model, 'change:output', this.render);
  },

  render: function () {
    var output = this.model.get('output') || '';
    this.$preview.html(output);
    this.$source.val(output ? '<p>' + output + '</p>' : '');
    return this;
  },

  events: {
    'keyup .editor>textarea': 'changeInput',
    'click .source>textarea': 'selectOutput'
  },

  changeInput: function (event) {
    this.model.set('input', this.$(event.target).val());
  },

  selectOutput: function () {
    this.$source.select();
  }
});


var ThemeIconView = Backbone.View.extend({
  Model: Theme,

  className: 'icon',

  initialize: function (options) {
    this.currentTheme = options.currentTheme;
  },

  render: function () {
    this.$el.css('background-color', this.model.get('icon'));
    var name = this.model.get('name');
    this.$el.attr('title', template('${name} theme', {
      name: name[0].toUpperCase() + name.slice(1)
    }));
    return this;
  },

  events: {
    'click': 'set'
  },

  set: function () {
    this.currentTheme.save(this.model.attributes);
  }
});


var ThemeIconsView = Backbone.View.extend({
  Model: Themes,

  constructor: function (options) {
    // The ordering of the collection is opposite, due to css floats.
    if (options.model) {
      options.model = new Themes(options.model.slice().reverse());
    }
    Backbone.View.call(this, options);
  },

  initialize: function (options) {
    this.iconViews = this.model.collect(function (theme) {
      return new ThemeIconView({
        model: theme,
        currentTheme: options.currentTheme
      });
    });
  },

  render: function () {
    this.$el.empty();
    this.iconViews.forEach(function (iconView) {
      this.$el.append(iconView.render().el);
    }, this);
    return this;
  }
});


var CurrentThemeView = Backbone.View.extend({
  Model: CurrentTheme,

  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function () {
    if (this.$el.data('name') != this.model.get('name')) {
      this.$el.data('name', this.model.get('name'));
      this.$el.attr('href', this.model.get('src'));
    }
    return this;
  }
});


var AppView = Backbone.View.extend({
  el: 'body',

  initialize: function () {
    this.converterView = new ConverterView({
      model: new Converter(),
      el: '#converter'
    });

    var currentTheme = new CurrentTheme();
    this.themeIconsView = new ThemeIconsView({
      model: new Themes(themes),
      currentTheme: currentTheme,
      el: '#theme-icons'
    });
    this.currentThemeView = new CurrentThemeView({
      model: currentTheme,
      el: '#theme-link'
    });
  },

  render: function () {
    this.converterView.render();
    this.themeIconsView.render();
    this.currentThemeView.render();
    return this;
  }
});


// Export the main application view only.
exports.AppView = AppView;
