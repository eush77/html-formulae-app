'use strict';

module.exports = function (grunt) {
  grunt.initConfig({

    // Test.
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

    // Build.
    concat: {
      css: {
        src: 'src/css/*.css',
        dest: 'dist/main.css'
      }
    },
    copy: {
      css: {
        expand: true,
        cwd: 'src/css',
        src: 'themes/*.css',
        dest: 'dist'
      },
      html: {
        expand: true,
        cwd: 'src/html',
        src: '**',
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

    // Publish.
    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: '**'
    },

    // Util.
    watch: {
      options: {
        livereload: true
      },
      config: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      js: {
        files: ['lib/src/**/*.js', 'lib/test/**/*.js', 'src/js/**/*.js'],
        tasks: ['test', 'browserify']
      },
      css: {
        files: ['src/css/**/*.css'],
        tasks: ['concat:css', 'copy:css']
      },
      html: {
        files: ['src/html/**/*.html'],
        tasks: ['copy:html']
      }
    },
    clean: ['dist'],
  });

  // Test.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  // Build.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  // Publish.
  grunt.loadNpmTasks('grunt-gh-pages');
  // Util.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.task.renameTask('mochaTest', 'mocha');

  grunt.registerTask('test', ['jshint', 'mocha']);
  grunt.registerTask('build', ['concat', 'copy', 'browserify']);
  grunt.registerTask('minify', ['uglify', 'cssmin', 'htmlmin']);
  // grunt clean
  // grunt gh-pages
  // grunt watch
  grunt.registerTask('default', ['test', 'build', 'minify']);
};
