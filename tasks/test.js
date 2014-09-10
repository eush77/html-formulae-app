'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    options: {
      jshintrc: true
    },
    lib: {
      src: ['lib/Gruntfile.js', 'lib/src/**/*.js', 'lib/test/**/*.js']
    },
    app: {
      src: ['Gruntfile.js', 'tasks/**/*.js', 'src/js/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.task.renameTask('mochaTest', 'mocha');
  grunt.config('mocha', {
    options: {
      reporter: 'spec',
      require: 'should'
    },
    lib: {
      src: 'lib/test/**/*.js'
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

  grunt.registerTask('test-lib', ['newer:jshint:lib', 'newer:mocha:lib']);
  grunt.registerTask('test-app', ['newer:jshint:app', 'newer:csslint:app']);
  grunt.registerTask('test', ['test-lib', 'test-app']);
}(global.grunt));
