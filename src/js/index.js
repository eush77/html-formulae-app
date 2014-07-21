'use strict';
var convert = require('./core');


(function () {
    var submit = function () {
        var code = document.getElementById('editor').value;
        var html = document.getElementById('preview').innerHTML = convert(code);
        document.getElementById('source').value = html ? '<p>' + html + '</p>' : '';
    };

    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('editor').addEventListener('keyup', submit);
      document.getElementById('source').addEventListener('click', function () {
          this.select();
      });
    });
}());
