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
      tasks: ['jshint:js']
    },
    lib: {
      files: ['lib/src/**/*.js', 'lib/test/**/*.js'],
      tasks: ['test-lib', 'browserify']
    },
    js: {
      files: ['src/js/**/*.js'],
      tasks: ['test-js', 'browserify']
    },
    css: {
      files: ['src/css/**/*.css'],
      tasks: ['test-css', 'concat:css', 'copy:themes', 'autoprefixer']
    },
    html: {
      files: ['src/html/**/*.jade'],
      tasks: ['jade']
    }
  });
}(global.grunt));
