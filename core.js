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
        , '<=>': '&thinsp;&hArr;&thinsp;'
        , '=>': '&thinsp;&rArr;&thinsp;'
        , '=<': '&thinsp;&lArr;&thinsp;'
        , '<->': '&harr;'
        , '->': '&rarr;'
        , '<-': '&larr;'
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
        , '~': '&sim;'
        , 'oo': '&infin;'
        , '\n': '<br/>'
        , '--': '&ndash;'
        , '---': '&mdash;'
        , '``': '&ldquo;'
        , '\'\'': '&rdquo;'
        , '<<': '&laquo;'
        , '>>': '&raquo;'
        , '||': '&or;'
        , '&&': '&and;'
        , '!': '&not;'
    };

    // Recursive descent parser
    this.convert = function(code) {
        var pos = 0;
        return function emit() {
            var c, output = [], buffer = '';
            var escaped = false; // Double escaping avoided
            while ((c = code[pos++]) && (c != '}' || escaped)) {
                if (!escaped && c in curlies) {
                    var group;
                    if (code[pos] == '{') {
                        ++pos;
                        group = emit();
                    }
                    else {
                        group = code[pos++];
                    }
                    output.push(replace(buffer), curlies[c](group));
                    buffer = '';
                }
                else {
                    escaped = !escaped && c == '\\';
                    buffer += c;
                }
            }
            return output.concat(replace(buffer)).join('');
        }();
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
