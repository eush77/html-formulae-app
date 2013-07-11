/*****************************************************************************************
* Syntax conventions:                                                                    *
* -> indices and powers: "x^2", "x_2";                                                   *
* -> special symbols: "<=>", "*", "->";                                                  *
* -> whitespace sequences: "  " denotes em-space, "\ " denotes thin-space;               *
* -> any correct HTML, including tags and entities.                                      *
* Notes:                                                                                 *
* 1) "<=>" and "=" preserve appropriate spacing on both sides;                           *
* 2) "{}"-groupings in indices and powers are also available;                            *
* 3) "\" is the escape character, except when it occures before space character in "\ ". *
*****************************************************************************************/

var submit = function() {
    var code = document.getElementById('editor').value;
    var html = document.getElementById('preview').innerHTML = convert(code);
    document.getElementById('source').value = html ? '<p>' + html + '</p>' : '';
};

var replace = function(code, dict) {
    var keys = Object.keys(dict);
    for (var k = 0; k < keys.length; ++k) {
        code = code.replace(keys[k], dict[keys[k]]);
    }
    return code;
};

var convert = function(code) {
    code = replace(code, {
        '<=>': '&emsp;&hArr;&emsp;',
        '  ': '&emsp;',
        '*': '&middot;',
        '->': '&rarr;'
    });
    var output = '';
    var escapeChar = '\\', escaped = false;
    var curlyState = null, curlies = {'_': 'sub', '^': 'sup'};
    // DFA begin
    for (var k = 0; k < code.length; ++k) {
        var c = code[k];
        // Toss escaped character away
        if (escaped) {
            output += c == ' ' ? '&thinsp;' : c;
            escaped = false;
            continue;
        }
        // Render brace-enclosed code
        if (curlyState) {
            output += '<' + curlyState + '>';
            var rightBrace;
            if (c == '{' && ((rightBrace = code.indexOf('}', k)) != -1)) {
                output += code.slice(k + 1, rightBrace);
                k = rightBrace;
            }
            else {
                output += c;
            }
            output += '</' + curlyState + '>';
            curlyState = null;
            continue;
        }
        // Check for brace-enclosure flag
        if ((function() {
            var found = curlies.hasOwnProperty(c);
            if (found) {
                curlyState = curlies[c];
            }
            return found;
        })()) {
            continue;
        }
        // Handle the rest of characters
        switch (c) {
        case escapeChar:
            escaped = true;
            break;
        case '=':
            output += '&thinsp;' + c + '&thinsp;';
            break;
        default:
            output += c;
        }
    }
    return output;
};
