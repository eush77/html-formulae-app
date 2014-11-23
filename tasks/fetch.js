'use strict';

var glyphs = require('../glyphs.json');

var cssCodepoints = require('css-codepoints')
  , zipmap = require('zipmap')
  , pairs = require('lodash.pairs')
  , extend = require('extend')
  , template = require('lodash.template');

var fs = require('fs');


var iconFileTemplate = template('u${codepoint}-${name}.svg');

(function (grunt) {
  grunt.loadNpmTasks('grunt-curl');
  grunt.config('curl', zipmap(pairs(glyphs.icons).map(function (icon) {
    icon = extend({name: icon[0]}, icon[1]);
    return {
      key: 'glyphs/src/' + iconFileTemplate(icon),
      value: icon.url
    };
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

  grunt.registerTask('css-codepoints', 'Generate CSS classes per font glyph.', function () {
    var css = cssCodepoints(extend({}, glyphs, {
      icons: zipmap(pairs(glyphs.icons).map(function (icon) {
        return [icon[0], icon[1].codepoint];
      }))
    }));

    grunt.file.write('glyphs/ionicons.css', css);
    grunt.log.ok('CSS generated.');
  });

  grunt.registerTask('fetch', ['curl', 'svgicons2svgfont', 'css-codepoints']);
}(global.grunt));


module.exports = !fs.existsSync('glyphs/ionicons.svg');
