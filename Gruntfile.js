'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['src/js/*.js', 'test/**/*.js']
    },
    mocha: {
      options: {
        reporter: 'spec',
        require: 'should'
      },
      all: ['test/**/*.js']
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '{css,js}/**',
          dest: 'dist'
        }, {
          expand: true,
          cwd: 'src/html',
          src: '*',
          dest: 'dist'
        }]
      }
    },
    clean: ['dist'],
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: '**'
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.task.renameTask('mochaTest', 'mocha');

  grunt.registerTask('default', ['jshint', 'mocha', 'copy']);
};
