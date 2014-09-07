'use strict';

module.exports = function (grunt) {
  grunt.initConfig({

    // Test.
    jshint: {
      options: {
        jshintrc: true
      },
      lib: ['lib/Gruntfile.js', 'lib/src/**/*.js', 'lib/test/**/*.js'],
      js: ['Gruntfile.js', 'src/js/**/*.js']
    },
    mocha: {
      options: {
        reporter: 'spec',
        require: 'should'
      },
      lib: ['lib/test/**/*.js']
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: ['src/css/**/*.css']
    },

    // Build.
    jade: {
      options: {
        client: false,
      },
      index: {
        src: 'src/html/index.jade',
        dest: 'dist'
      }
    },
    concat: {
      css: {
        src: 'src/css/*.css',
        dest: 'dist/main.css'
      }
    },
    copy: {
      themes: {
        expand: true,
        cwd: 'src/css',
        src: 'themes/*.css',
        dest: 'dist'
      }
    },
    autoprefixer: {
      css: {
        expand: true,
        cwd: 'dist',
        src: '**/*.css',
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
    },
    clean: ['dist'],
  });

  // Test.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  // Build.
  grunt.loadNpmTasks('grunt-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-autoprefixer');
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

  grunt.registerTask('test-lib', ['jshint:lib', 'mocha:lib']);
  grunt.registerTask('test-js', ['jshint:js']);
  grunt.registerTask('test-css', ['csslint']);
  grunt.registerTask('test', ['test-lib', 'test-js', 'test-css']);
  grunt.registerTask('build', ['jade', 'concat', 'copy', 'autoprefixer', 'browserify']);
  grunt.registerTask('minify', ['uglify', 'cssmin', 'htmlmin']);
  // grunt clean
  // grunt gh-pages
  // grunt watch
  grunt.registerTask('default', ['test', 'build', 'minify']);
};
