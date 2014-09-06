'use strict';

var Converter = require('./models').Converter
  , Themes = require('./models').Themes
  , Theme = require('./models').Theme
  , CurrentTheme = require('./models').CurrentTheme
  , History = require('./models').History
  , themes = require('../themes.json');

var Backbone = require('backbone')
  , $ = require('jquery')
  , template = require('lodash.template');


var ConverterView = Backbone.View.extend({
  Model: Converter,

  initialize: function () {
    this.$editor = this.$('.editor');
    this.$preview = this.$('.preview');
    this.$source = this.$('.source');

    this.listenTo(this.model, 'change:input', this.updateInput);
    this.listenTo(this.model, 'change:output', this.render);
  },

  render: function () {
    var output = this.model.get('output') || '';
    this.$preview.html(output);
    this.$source.val(output ? '<p>' + output + '</p>' : '');
    return this;
  },

  updateInput: function () {
    var input = this.model.get('input');
    if (this.$editor.val() != input) {
      this.$editor.val(input);
    }
  },

  events: {
    'keyup .editor': 'changeInput',
    'click .source': 'selectOutput'
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

  tagName: 'i',

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


var HistoryEntryView = Backbone.View.extend({
  Model: Converter,

  tagName: 'li',

  template: function () {
    return template($('#history-entry-template').html());
  },

  initialize: function (options) {
    this.template = this.template();
    this.converter = options.converter;
  },

  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this;
  },

  events: {
    'mousedown': function (event) {
      event.preventDefault();
    },
    'click': 'restore',
    'click .pop': 'pop'
  },

  restore: function () {
    this.converter.set('input', this.model.get('input'));
  },

  pop: function (event) {
    this.model.destroy();
    event.stopPropagation();
  }
});


var HistoryView = Backbone.View.extend({
  Model: History,

  initialize: function (options) {
    this.converter = options.converter;
    this.$pushButton = this.$('.push');
    this.$list = this.$('ul');

    this.views = this.model.collect(function (entry) {
      return new HistoryEntryView({
        model: entry,
        converter: options.converter
      });
    });

    this.listenTo(this.model, 'add', function (m, c, options) {
      this.addEntry(options.at);
    });
    this.listenTo(this.model, 'remove', function (m, c, options) {
      this.removeEntry(options.index);
    });
    this.listenTo(this.converter, 'change:input', this.reactivatePushButton);
  },

  render: function () {
    this.reactivatePushButton();
    this.$list.empty();
    this.views.forEach(function (entryView) {
      this.$list.append(entryView.render().el);
    }, this);
    return this;
  },

  addEntry: function (at) {
    var entryView = new HistoryEntryView({
      model: this.model.at(at),
      converter: this.converter
    });
    this.views.splice(at, 0, entryView);
    var entryEl = entryView.render().el;
    if (at) {
      this.$list.children().eq(at - 1).insertAfter(entryEl);
    }
    else {
      this.$list.prepend(entryEl);
    }
  },

  removeEntry: function (at) {
    this.views[at].stopListening();
    this.views.splice(at, 1);
    this.$list.children().eq(at).remove();
  },

  reactivatePushButton: function () {
    this.$pushButton.attr('disabled', !this.converter.get('input'));
  },

  events: {
    'click .push': 'pushToHistory'
  },

  pushToHistory: function () {
    this.model.create(this.converter.clone().set({
      id: this.model.nextId--
    }), {at: 0});
  }
});


var AppView = Backbone.View.extend({
  el: 'body',

  initialize: function () {
    var converter = new Converter();
    this.converterView = new ConverterView({
      model: converter,
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

    this.historyView = new HistoryView({
      model: new History(),
      converter: converter,
      el: '#history'
    });
  },

  render: function () {
    this.converterView.render();
    this.themeIconsView.render();
    this.currentThemeView.render();
    this.historyView.render();
    return this;
  }
});


// Export the main application view only.
exports.AppView = AppView;
