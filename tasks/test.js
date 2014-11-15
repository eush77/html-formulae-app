'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    options: {
      jshintrc: true
    },
    app: {
      src: ['src/js/**/*.js']
    },
    build: {
      src: ['Gruntfile.js', 'tasks/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.config('csslint', {
    options: {
      csslintrc: '.csslintrc'
    },
    app: {
      src: 'src/css/**/*.css'
    }
  });

  grunt.registerTask('test', ['newer:jshint', 'newer:csslint']);
}(global.grunt));
