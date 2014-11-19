'use strict';

module.exports = function (grunt) {
  global.grunt = grunt;
  grunt.loadNpmTasks('grunt-newer');

  var doFetch = require('./tasks/fetch');
  require('./tasks/test');
  require('./tasks/build');
  require('./tasks/minify');

  // Tasks that run independently.
  require('./tasks/publish');
  require('./tasks/watch');
  require('./tasks/clean');

  var pipeline = (doFetch ? ['fetch'] : []).concat(['test', 'build', 'minify']);
  grunt.registerTask('default', pipeline);
};
