'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
    index: {
      files: {
        'dist/index.js': 'dist/index.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.config('cssmin', {
    all: {
      expand: true,
      cwd: 'dist/',
      src: '**/*.css',
      dest: 'dist/'
    },
  });

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.config('htmlmin', {
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
  });

  grunt.registerTask('minify', ['uglify', 'cssmin', 'htmlmin']);
}(global.grunt));