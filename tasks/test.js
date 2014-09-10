'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    options: {
      jshintrc: true
    },
    lib: ['lib/Gruntfile.js', 'lib/src/**/*.js', 'lib/test/**/*.js'],
    js: ['Gruntfile.js', 'tasks/**/*.js', 'src/js/**/*.js']
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.task.renameTask('mochaTest', 'mocha');
  grunt.config('mocha', {
    options: {
      reporter: 'spec',
      require: 'should'
    },
    lib: ['lib/test/**/*.js']
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.config('csslint', {
    options: {
      csslintrc: '.csslintrc'
    },
    all: ['src/css/**/*.css']
  });

  grunt.registerTask('test-lib', ['jshint:lib', 'mocha:lib']);
  grunt.registerTask('test-js', ['jshint:js']);
  grunt.registerTask('test-css', ['csslint']);
  grunt.registerTask('test', ['test-lib', 'test-js', 'test-css']);
}(global.grunt));
