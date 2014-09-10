'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    options: {
      livereload: true
    },
    config: {
      files: ['Gruntfile.js', 'tasks/**/*.js'],
      options: {
        reload: true
      },
      tasks: ['test-app']
    },
    lib: {
      files: ['lib/src/**/*.js', 'lib/test/**/*.js'],
      tasks: ['test-lib', 'build']
    },
    app: {
      files: ['src/html/**/*.jade', 'src/css/**/*.css', 'src/js/**/*.js'],
      tasks: ['test-app', 'build']
    },
  });
}(global.grunt));
