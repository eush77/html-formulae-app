'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
    all: {
      expand: true,
      cwd: 'dist',
      src: '**/*.js',
      dest: 'dist'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.config('cssmin', {
    all: {
      expand: true,
      cwd: 'dist',
      src: '**/*.css',
      dest: 'dist'
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
    all: {
      expand: true,
      cwd: 'dist',
      src: '**/*.html',
      dest: 'dist'
    },
  });

  grunt.loadNpmTasks('grunt-svgmin');
  grunt.config('svgmin', {
    all: {
      expand: true,
      cwd: 'dist',
      src: '**/*.svg',
      dest: 'dist'
    }
  });

  grunt.registerTask('minify', ['newer:uglify', 'newer:cssmin', 'newer:htmlmin', 'newer:svgmin']);
}(global.grunt));