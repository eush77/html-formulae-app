'use strict';

var _ = {
  template: require('lodash.template')
};


var $themeIcons = null;
var $themeLink = null;


var storage = (function () {
  var key = 'theme';

  return {
    load: function () {
      return window.localStorage[key];
    },
    save: function (name) {
      window.localStorage[key] = name;
    }
  };
}());


var loadTheme = function (theme) {
  $themeLink.href = theme.src;
};


var putIcon = (function () {
  var newIcon = function () {
    var div = document.createElement('div');
    div.className = 'icon';
    $themeIcons.appendChild(div);
    return div;
  };

  return function (color) {
    var icon = newIcon();
    icon.style.backgroundColor = color;
    return icon;
  };
}());


var installTheme = function (theme) {
  var icon = putIcon(theme.icon);
  icon.title = _.template('${name} theme', {
    name: theme.name[0].toUpperCase() + theme.name.slice(1)
  });
  icon.addEventListener('click', function () {
    loadTheme(theme);
    storage.save(theme.name);
  });
};


exports.init = function () {
  $themeIcons = document.getElementById('theme-icons');
  $themeLink = document.getElementById('theme');

  var themes = require('../themes.json');
  var themeByName = Object.create(null);
  themes.reverse().forEach(function (theme) {
    installTheme(theme);
    themeByName[theme.name] = theme;
  });

  var savedTheme = storage.load();
  if (savedTheme && themeByName[savedTheme]) {
    loadTheme(themeByName[savedTheme]);
  }
};
