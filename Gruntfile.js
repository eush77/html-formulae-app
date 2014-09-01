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
        files: [{
          expand: true,
          cwd: 'src/css',
          src: '**',
          dest: 'dist'
        }, {
          expand: true,
          cwd: 'src/html',
          src: '**',
          dest: 'dist'
        }]
      },
    },
    browserify: {
      index: {
        files: {
          'dist/index.js': 'src/js/index.js'
        }
      }
    },
    uglify: {
      index: {
        files: {
          'dist/index.js': 'dist/index.js'
        }
      }
    },
    cssmin: {
      all: {
        expand: true,
        cwd: 'dist/',
        src: '**/*.css',
        dest: 'dist/'
      },
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true
      },
      index: {
        files: {
          'dist/index.html': 'dist/index.html'
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
    watch: {
      script: {
        files: ['lib/src/**/*.js', 'lib/test/**/*.js', 'src/js/**/*.js'],
        tasks: ['build']
      },
      'styles&markup': {
        files: ['src/css/**/*.css', 'src/html/**/*.html'],
        tasks: ['copy']
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.task.renameTask('mochaTest', 'mocha');

  grunt.registerTask('test', ['jshint', 'mocha']);
  grunt.registerTask('build', ['copy', 'browserify']);
  grunt.registerTask('minify', ['uglify', 'cssmin', 'htmlmin']);
  // grunt clean
  // grunt gh-pages
  // grunt watch
  grunt.registerTask('default', ['test', 'build', 'minify']);
};