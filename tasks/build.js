'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-jade');
  grunt.config('jade', {
    options: {
      client: false,
    },
    index: {
      src: 'src/html/index.jade',
      dest: 'dist'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.config('concat', {
    css: {
      src: 'src/css/*.css',
      dest: 'dist/main.css'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.config('copy', {
    themes: {
      expand: true,
      cwd: 'src/css',
      src: 'themes/*.css',
      dest: 'dist'
    }
  });

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.config('autoprefixer', {
    css: {
      expand: true,
      cwd: 'dist',
      src: '**/*.css',
      dest: 'dist'
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.config('browserify', {
    index: {
      files: {
        'dist/index.js': 'src/js/index.js'
      }
    }
  });

  grunt.registerTask('build', ['jade', 'concat', 'copy', 'autoprefixer', 'browserify']);
}(global.grunt));