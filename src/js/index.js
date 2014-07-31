'use strict';

var convert = require('../../lib/src/convert');


var editor = document.getElementById('editor'),
    preview = document.getElementById('preview'),
    source = document.getElementById('source');


editor.addEventListener('keyup', function () {
  var html = convert(editor.value);
  preview.innerHTML = html;
  source.value = html ? '<p>' + html + '</p>' : '';
});


source.addEventListener('click', function () {
  this.select();
});


require('./themes').init();
