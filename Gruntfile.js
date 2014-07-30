'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['lib/Gruntfile.js', 'lib/src/**/*.js', 'lib/test/**/*.js',
            'Gruntfile.js', 'src/js/**/*.js']
    },
    mocha: {
      options: {
        reporter: 'spec',
        require: 'should'
      },
      all: ['lib/test/**/*.js']
    },
    copy: {
      dist: {
        expand: true,
        flatten: true,
        src: 'src/{css,html}/**/*',
        filter: 'isFile',
        dest: 'dist'
      }
    },
    browserify: {
      index: {
        files: {
          'dist/index.js': 'src/js/index.js'
        }
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
  grunt.loadNpmTasks('grunt-browserify');
  grunt.task.renameTask('mochaTest', 'mocha');

  grunt.registerTask('test', ['jshint', 'mocha']);
  grunt.registerTask('build', ['test', 'copy', 'browserify']);
  // grunt clean
  // grunt gh-pages
  grunt.registerTask('default', 'build');
};
