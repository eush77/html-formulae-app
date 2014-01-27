var core = new function() {

    this.submit = function() {
        var code = document.getElementById('editor').value;
        var html = document.getElementById('preview').innerHTML = this.convert(code);
        document.getElementById('source').value = html ? '<p>' + html + '</p>' : '';
    };

    var methodCaller = function(method) {
        return function(obj) {
            return obj[method]();
        };
    };

    var curlies = {
        '_': methodCaller('sub'),
        '^': methodCaller('sup')
    };

    var replaceDict = {
        '<': '&lt;'
        , '<=': '&le;'
        , '>': '&gt;'
        , '>=': '&ge;'
        , '!=': '&ne;'
        , '/=': '&ne;'
        , '==': '&#9552;'
        , '<<': '&#8810;'
        , '>>': '&#8811;'
        , '<=>': '&thinsp;&hArr;&thinsp;'
        , '=>': '&thinsp;&rArr;&thinsp;'
        , '=<': '&thinsp;&lArr;&thinsp;'
        , '<==>': '&thinsp;&#10234;&thinsp;'
        , '==>': '&thinsp;&#10233;&thinsp;'
        , '==<': '&thinsp;&#10232;&thinsp;'
        , '<->': '&harr;'
        , '->': '&rarr;'
        , '<-': '&larr;'
        , '<-->': '&#10231;'
        , '-->': '&#10230;'
        , '<--': '&#10229;'
        , '   ': '&emsp;'
        , '  ': '&ensp;'
        , '.': '&thinsp;'
        , '*': '&sdot;'
        , '-': '&minus;'
        , '&': '&amp;'
        , '+-': '&plusmn;'
        , '-+': '&#8723;'
        , 'setP': '&#8473;'
        , 'setN': '&#8469;'
        , 'setZ': '&#8484;'
        , 'setQ': '&#8474;'
        , 'setR': '&#8477;'
        , 'setC': '&#8450;'
        , 'setF': '&#120125;'
        , '~': '&sim;'
        , 'oo': '&infin;'
        , '\n': '<br/>'
        , '--': '&ndash;'
        , '---': '&mdash;'
        , '``': '&ldquo;'
        , '\'\'': '&rdquo;'
        , '<<<': '&laquo;'
        , '>>>': '&raquo;'
        , '||': '&or;'
        , '&&': '&and;'
        , '!': '&not;'
        , ':=': '&#8788;'
        , '=def=': '&#8797'
        , '~~': '&asymp;'
        , ']]': '&#8848; '
        , '|-': '&#8866;'
        , '|=': '&#8872;'
        , 'TT': '&#8868;'
        , 'BB': '&perp;'
    };

    var preConvertHooks = [
        function skipRegularLetterDoubling(code) {
            var inTextReplacePattern = '$1\\$2';
            ['T', 'B'].forEach(function(c) {
                code = code.replace(RegExp('(\\wc)(c)'.replace(/c/g, c), 'g'), inTextReplacePattern)
                    .replace(RegExp('(c)(c\\w)'.replace(/c/g, c), 'g'), inTextReplacePattern);
            });
            return code;
        },
    ];

    var postConvertHooks = [
        function smartHyphen(code) {
            var minus = replaceDict['-'];
            var punctuation = '[,.:)!?;\'"]?';
            var space = '(\\s|{.}|{  }|{   })'.replace(RegExp('\\{(.+?)\\}', 'g'), function(m, s) {
                return replaceDict[s];
            });
            var re = RegExp(('(^|SPACE)(([a-zA-Z]{2,}MINUS)+[a-zA-Z]{2,}PUNCTSPACE+)*'
                            + '([a-zA-Z]{2,}MINUS)+[a-zA-Z]{2,}PUNCT(SPACE|$)')
                            .replace(/MINUS/g, minus)
                            .replace(/PUNCT/g, punctuation)
                            .replace(/SPACE/g, space)
                            , 'g');
            return code.replace(re, function(substr) {
                return substr.replace(RegExp(minus, 'g'), '-');
            });
        },
    ];

    // Recursive descent parser
    this.convert = function(code) {
        preConvertHooks.forEach(function(hook) {
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
            return output.concat(replace(buffer)).join('');
        }(0));
        postConvertHooks.forEach(function(hook) {
            code = hook(code);
        });
        return code;
    };

    // Split replaceDict into groups by key length (= replace priority)
    var replaceBase = function() {
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
    }();

    // Replace character sequences according to replaceDict
    var replace = function(plain) {
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

}();
