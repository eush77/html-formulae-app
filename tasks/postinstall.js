'use strict';

var glyphs = require('../glyphs.json');

var cssCodepoints = require('css-codepoints')
  , zipObject = require('lodash.zipobject')
  , pairs = require('lodash.pairs')
  , template = require('lodash.template');


var iconFileTemplate = template('u${codepoint}-${name}.svg');
var iconSourceTemplate = template('https://raw.githubusercontent.com/driftyco/ionicons'
                                  + '/master/src/${name}.svg');

(function (grunt) {
  grunt.loadNpmTasks('grunt-curl');
  grunt.config('curl', zipObject(pairs(glyphs.icons).map(function (icon) {
    icon = zipObject(['name', 'codepoint'], icon);
    return ['glyphs/src/' + iconFileTemplate(icon), iconSourceTemplate(icon)];
  })));

  grunt.loadNpmTasks('grunt-svgicons2svgfont');
  grunt.config('svgicons2svgfont', {
    options: {
      font: 'ionicons'
    },
    ionicons: {
      src: 'glyphs/src/*.svg',
      dest: 'glyphs'
    },
  });

  grunt.registerTask('fontcss', 'Generate CSS classes per font glyph.', function () {
    grunt.file.write('glyphs/ionicons.css', cssCodepoints(glyphs));
    grunt.log.ok('CSS generated.');
  });

  grunt.registerTask('postinstall', ['curl', 'svgicons2svgfont', 'fontcss']);
}(global.grunt));
