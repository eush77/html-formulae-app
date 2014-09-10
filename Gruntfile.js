'use strict';

module.exports = function (grunt) {
  global.grunt = grunt;

  require('./tasks/test');
  require('./tasks/build');
  require('./tasks/minify');
  require('./tasks/publish');
  require('./tasks/watch');
  require('./tasks/clean');

  grunt.registerTask('default', ['test', 'build', 'minify']);
};
