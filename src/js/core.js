'use strict';

function Core(_) {
  var methodCaller = function (method) {
    return function (obj) {
      return obj[method]();
    };
  };

  var curlies = {
    '_': methodCaller('sub'),
    '^': methodCaller('sup')
  };

  var replaceDict = {
    '<': '&lt;',
    '<=': '&le;',
    '>': '&gt;',
    '>=': '&ge;',
    '!=': '&ne;',
    '/=': '&ne;',
    '==': '&#9552;',
    '<<': '&#8810;',
    '>>': '&#8811;',
    '<=>': '&thinsp;&hArr;&thinsp;',
    '=>': '&thinsp;&rArr;&thinsp;',
    '=<': '&thinsp;&lArr;&thinsp;',
    '<==>': '&thinsp;&#10234;&thinsp;',
    '==>': '&thinsp;&#10233;&thinsp;',
    '==<': '&thinsp;&#10232;&thinsp;',
    '<->': '&harr;',
    '->': '&rarr;',
    '<-': '&larr;',
    '<-->': '&#10231;',
    '-->': '&#10230;',
    '<--': '&#10229;',
    '   ': '&emsp;',
    '  ': '&ensp;',
    '.': '&thinsp;',
    '*': '&sdot;',
    '-': '&minus;',
    '&': '&amp;',
    '+-': '&plusmn;',
    '-+': '&#8723;',
    'setP': '&#8473;',
    'setN': '&#8469;',
    'setZ': '&#8484;',
    'setQ': '&#8474;',
    'setR': '&#8477;',
    'setC': '&#8450;',
    'setF': '&#120125;',
    '~': '&sim;',
    'oo': '&infin;',
    '\n': '<br/>',
    '--': '&ndash;',
    '---': '&mdash;',
    '``': '&ldquo;',
    '\'\'': '&rdquo;',
    '<<<': '&laquo;',
    '>>>': '&raquo;',
    '||': '&or;',
    '&&': '&and;',
    '!': '&not;',
    ':=': '&#8788;',
    '=def=': '&#8797;',
    '~~': '&asymp;',
    ']]': '&#8848; ',
    '|-': '&#8866;',
    '|=': '&#8872;',
    'TT': '&#8868;',
    'BB': '&perp;',
  };

  (function installMathematicalBoldScriptLetters(dict) {
    var installAlphabet = function (mnemonicPrefix, aScriptCode, aRegularCode, size) {
      size = size || 26; // Latin by default
      for (var letterIndex = 0; letterIndex < size; ++letterIndex) {
        var mnemonic = mnemonicPrefix + String.fromCharCode(aRegularCode + letterIndex);
        var html = ['&#x', (aScriptCode + letterIndex).toString(0x10), ';'].join('');
        dict[mnemonic] = html;
      }
    };
    installAlphabet('mbscript', 0x1d4d0, 'A'.charCodeAt());
    installAlphabet('mbscript', 0x1d4ea, 'a'.charCodeAt());
  }(replaceDict));

  var preConvertHooks = [
    function skipRegularLetterDoubling(code) {
      var inTextReplacePattern = '$1\\$2';
      ['T', 'B'].forEach(function (char) {
        var regexLeft = new RegExp(_.template('(\\w${c})(${c})', {c: char}), 'g');
        var regexRight = new RegExp(_.template('(${c})(${c}\\w)', {c: char}), 'g');
        code = code.replace(regexLeft, inTextReplacePattern)
                   .replace(regexRight, inTextReplacePattern);
      });
      return code;
    },
    function doubleLetterO(code) {
      var isLetter = function (char) {
        return /[a-zA-Z]/.test(char || '');
      };
      return code.replace(/oo/g, function (match, offset) {
        var protect = isLetter(code[offset - 1]) || isLetter(code[offset + match.length]);
        return protect ? 'o\\o' : 'oo';
      });
    },
  ];

  var postConvertHooks = [
    function smartHyphen(code) {
      var minus = replaceDict['-'];
      var punctuation = '[,.:)!?;\'"]?';
      var space = '(\\s|{.}|{  }|{   })'.replace(new RegExp('\\{(.+?)\\}', 'g'), function (m, s) {
        return replaceDict[s];
      });
      var word = '[a-zA-Z\']{2,}';
      var re = new RegExp(_.template('(^|${space})((${word}${minus})+${word}${punct}${space}+)*' +
                                     '(${word}${minus})+${word}${punct}(${space}|$)',
                                     {
                                       minus: minus,
                                       punct: punctuation,
                                       space: space,
                                       word: word
                                     }),
                          'g');
      return code.replace(re, function (substr) {
        return substr.replace(new RegExp(minus, 'g'), '-');
      });
    },
  ];

  // Recursive descent parser
  this.convert = function (code) {
    preConvertHooks.forEach(function (hook) {
      code = hook(code);
    });
    var pos = 0;
    code = (function emit(level, quota) {
      quota = quota || Infinity;
      var c, output = [], buffer = '';
      var escaped = false; // Double escaping avoided
      while ((c = code[pos++]) && (c != '}' || level == 0 || escaped)) {
        if (!escaped && c in curlies && code[pos]) {
          var group;
          if (code[pos] == '{') {
            ++pos;
            group = emit(level + 1);
          }
          else {
            group = emit(level, 1);
          }
          output.push(replace(buffer), curlies[c](group));
          buffer = '';
        }
        else {
          buffer += c;
          if (!(escaped = !escaped && c == '\\') && !--quota) {
            break;
          }
        }
      }
      if (escaped) {
        buffer += '\\';
      }
      return output.concat(replace(buffer)).join('');
    }(0));
    postConvertHooks.forEach(function (hook) {
      code = hook(code);
    });
    return code;
  };

  // Split replaceDict into groups by key length (= replace priority)
  var replaceBase = (function () {
    var base = [];
    for (var seq in replaceDict) {
      var key = seq.length;
      if (!(key in base)) {
        base[key] = {
          len: key,
          dict: {}
        };
      }
      base[key].dict[seq] = replaceDict[seq];
    }
    return base.filter(Boolean).reverse(); // Compress and reverse
  }());

  // Replace character sequences according to replaceDict
  var replace = function (plain) {
    var output = '', pos = 0;
    var escaped = false;
    outer:while (pos < plain.length) {
      if (escaped) {
        output += plain[pos++];
        escaped = false;
      }
      else if (plain[pos] == '\\') {
        ++pos;
        escaped = true;
      }
      else {
        for (var r = 0; r < replaceBase.length; ++r) {
          var len = replaceBase[r].len, substr = plain.slice(pos, pos + len);
          if (substr in replaceBase[r].dict) {
            output += replaceBase[r].dict[substr];
            pos += len;
            continue outer;
          }
        }
        output += plain[pos++];
      }
    }
    return output;
  };
}

if (typeof(module) != 'undefined') {
  var _ = require('./lib/lodash.min');
  module.exports = new Core(_).convert;
}
else {
  window.core = new Core(window._);
}