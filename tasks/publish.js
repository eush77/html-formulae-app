'use strict';

(function (grunt) {
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.config('gh-pages', {
      options: {
        base: 'dist'
      },
      src: '**'
  });

  grunt.registerTask('publish', ['gh-pages']);
}(global.grunt));
