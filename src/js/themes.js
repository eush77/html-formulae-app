'use strict';

var themeIcons = null;
var themeLink = null;


var loadTheme = function (src) {
  themeLink.href = src;
};


var putIcon = (function () {
  var newIcon = function () {
    var div = document.createElement('div');
    div.className = 'icon';
    themeIcons.appendChild(div);
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
  icon.title = 'Change theme: ' + theme.name;
  icon.addEventListener('click', loadTheme.bind(null, theme.src));
};


exports.init = function () {
  themeIcons = document.getElementById('theme-icons');
  themeLink = document.getElementById('theme');

  var themes = require('../themes.json');
  themes.reverse().forEach(installTheme);
};
