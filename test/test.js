/* global describe, it */
'use strict';

var convert = require('../core');


describe('Core functionality', function () {
  it('should map empty string to itself', function () {
    convert('').should.equal('');
  });

  it('should treat backslash as an escape character', function () {
    var bs = function (str) {
      return str.replace(/\//g, '\\');
    };
    convert(bs('e/-mail')).should.equal('e-mail');
    convert(bs('/\n')).should.equal('\n');
    convert(bs('=/=/.')).should.equal('==.');
    convert(bs('/&Delta;^{/&dagger;}')).should.equal('&Delta;<sup>&dagger;</sup>');
    convert(bs('/')).should.equal(bs('/'));
    convert(bs('//')).should.equal(bs('/'));
    convert(bs('///')).should.equal(bs('//'));
    convert(bs('////')).should.equal(bs('//'));
  });

  it('should support indices and powers syntax', function () {
    convert('2^2').should.equal('2<sup>2</sup>');
    convert('2_2').should.equal('2<sub>2</sub>');
    convert('2_{2}').should.equal('2<sub>2</sub>');
    convert('2_{2^2}').should.equal('2<sub>2<sup>2</sup></sub>');
    convert('2_{2^{2}}^2').should.equal('2<sub>2<sup>2</sup></sub><sup>2</sup>');
  });

  it('should preserve newlines', function () {
    convert('\n').should.equal('<br/>');
    convert('1\n2\n\n3').should.equal('1<br/>2<br/><br/>3');
  });
});


describe('Mathematical bold script', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('mbscripta').should.equal('&#x1d4ea;');
    convert('mbscriptb').should.equal('&#x1d4eb;');
    convert('mbscriptz').should.equal('&#x1d503;');
    convert('mbscriptA').should.equal('&#x1d4d0;');
    convert('mbscriptZ').should.equal('&#x1d4e9;');
    convert('mbscript').should.equal('mbscript');
    convert('mbscript0').should.equal('mbscript0');
    convert('mbscriptambscripta').should.equal('&#x1d4ea;&#x1d4ea;');
  });
});


describe('Abstract and common number sets', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('setA').should.equal('setA');
    convert('setF').should.equal('&#120125;');
    convert('setC').should.equal('&#8450;');
    convert('setR').should.equal('&#8477;');
    convert('setQ').should.equal('&#8474;');
    convert('setZ').should.equal('&#8484;');
    convert('setN').should.equal('&#8469;');
    convert('setP').should.equal('&#8473;');
    convert('setsetR').should.equal('set&#8477;');
  });
});


describe('Arithmetic and logical operators', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('1+1-1*1/1').should.equal('1+1&minus;1&sdot;1/1');
    convert('true && false || !true').should.equal('true &and; false &or; &not;true');
    convert('x&&!!x||!x').should.equal('x&and;&not;&not;x&or;&not;x');
  });

  it('should not replace hyphens with minuses in compound words', function () {
    convert('test-driven').should.equal('test-driven');
    convert('test-driven0').should.equal('test&minus;driven0');
    convert('test-driven-').should.equal('test&minus;driven&minus;');
    convert('co-sine^2').should.equal('co&minus;sine<sup>2</sup>');
    convert('merry-go-round').should.equal('merry-go-round');
    convert('de-Stalinisation').should.equal('de-Stalinisation');
    convert('Merriam-Webster\'s').should.equal('Merriam-Webster\'s');
    convert('father-in-law\'s').should.equal('father-in-law\'s');
    convert('O\'Brien-Schwartz\'s restaurant').should.equal('O\'Brien-Schwartz\'s restaurant');
    convert('syl-la-bi-fi-ca-tion').should.equal('syl-la-bi-fi-ca-tion');
    convert('e-mail').should.equal('e&minus;mail'); // Single letters don't count.
    convert('pre-1949').should.equal('pre&minus;1949');
  });
});

describe('Comparison relations', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('x = 1 < 2 <= 3 == 3 >= 2 > 1 != 0 /= x')
      .should.equal('x = 1 &lt; 2 &le; 3 &#9552; 3 &ge; 2 &gt; 1 &ne; 0 &ne; x');
    convert('x <== y').should.equal('x &le;= y');
    convert('x<<+oo, x>>-oo').should.equal('x&#8810;+&infin;, x&#8811;&minus;&infin;');
    convert('x ~ y ~~ z').should.equal('x &sim; y &asymp; z');
  });

  it('should parse equals/tilde sequences greedily', function () {
    convert('===').should.equal('&#9552;=');
    convert('====').should.equal('&#9552;&#9552;');
    convert('=====').should.equal('&#9552;&#9552;=');
    convert('~~~').should.equal('&asymp;&sim;');
    convert('~~~~').should.equal('&asymp;&asymp;');
    convert('~~~~~').should.equal('&asymp;&asymp;&sim;');
  });
});


describe('Inference relations and constants', function () {
  it('should put appropriate spacing on both sides of inference arrows', function () {
    convert('A=>B<=>C=<D')
      .should.equal('A&thinsp;&rArr;&thinsp;B&thinsp;&hArr;&thinsp;C&thinsp;&lArr;&thinsp;D');
    convert('A==>B<==>C==<D')
      .should.equal('A&thinsp;&#10233;&thinsp;B&thinsp;&#10234;&thinsp;C&thinsp;&#10232;&thinsp;D');
  });

  it('should replace other symbols with corresponding entities', function () {
    convert('I |= TT').should.equal('I &#8872; &#8868;');
    convert('I |- BB').should.equal('I &#8866; &perp;');
  });

  it('should leave "TT" and "BB" as is, if found close to an alphanumeric character', function () {
    convert('TTop').should.equal('TTop');
    convert('+TTop').should.equal('+TTop');
    convert('boTTom').should.equal('boTTom');
    convert('ttTT').should.equal('ttTT');
    convert('ttTT+').should.equal('ttTT+');
    convert('BBottom').should.equal('BBottom');
    convert('+BBottom').should.equal('+BBottom');
    convert('bbBB').should.equal('bbBB');
    convert('bbBB+').should.equal('bbBB+');
  });
});


describe('Arrows', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('A -> B <-> C <- D').should.equal('A &rarr; B &harr; C &larr; D');
    convert('A --> B <--> C <-- D').should.equal('A &#10230; B &#10231; C &#10229; D');
  });
});


describe('"Let" and defining signs', function () {
  it('should replace symbols with corresponding entities', function () {
    convert(']]').should.equal('&#8848; ');
    convert('x=def=def=2, y:=5', 'x&#8797;def=2, y&#8788;5');
  });

  it('should put a space after "let"', function () {
    convert(']]x>0').should.equal('&#8848; x&gt;0');
  });
});


describe('Various symbols', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('x+-y-+z +oo -oo').should.equal('x&plusmn;y&#8723;z +&infin; &minus;&infin;');
    convert('&alpha;').should.equal('&amp;alpha;'); // Do not forget escaping entities.
  });

  it('should not replace double "o" with infinity inside words', function () {
    convert('book').should.equal('book');
    convert('boook').should.equal('boook');
    convert('booook').should.equal('booook');
    convert('booooook').should.equal('booooook');
    convert('booooooook').should.equal('booooooook');
    convert('boobook').should.equal('boobook');
    convert('oocyte').should.equal('oocyte');
    convert('zoo').should.equal('zoo');
    convert('1oo1').should.equal('1&infin;1');
  });
});


describe('Dashes', function () {
  it('should parse dash sequences greedily', function () {
    convert('--').should.equal('&ndash;');
    convert('---').should.equal('&mdash;');
    convert('----').should.equal('&mdash;&minus;');
    convert('-----').should.equal('&mdash;&ndash;');
    convert('------').should.equal('&mdash;&mdash;');
    convert('-------').should.equal('&mdash;&mdash;&minus;');
  });
});


describe('Quotation marks', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('``Hello\'\' --- he said').should.equal('&ldquo;Hello&rdquo; &mdash; he said');
    convert('<<<Hello>>> --- he said').should.equal('&laquo;Hello&raquo; &mdash; he said');
  });

  it('should parse lt/gt sequences greedily', function () {
    convert('<<<').should.equal('&laquo;');
    convert('<<<<').should.equal('&laquo;&lt;');
    convert('<<<<<').should.equal('&laquo;&#8810;');
    convert('<<<<<<').should.equal('&laquo;&laquo;');
    convert('<<<<<<<').should.equal('&laquo;&laquo;&lt;');
    convert('>>>').should.equal('&raquo;');
    convert('>>>>').should.equal('&raquo;&gt;');
    convert('>>>>>').should.equal('&raquo;&#8811;');
    convert('>>>>>>').should.equal('&raquo;&raquo;');
    convert('>>>>>>>').should.equal('&raquo;&raquo;&gt;');
  });
});


describe('Whitespace sequences', function () {
  it('should support thin-space shorthand', function () {
    convert('.').should.equal('&thinsp;');
    convert('x.=.4').should.equal('x&thinsp;=&thinsp;4');
  });

  it('should parse whitespace sequences greedily', function () {
    convert(' ').should.equal(' ');
    convert('  ').should.equal('&ensp;');
    convert('   ').should.equal('&emsp;');
    convert('    ').should.equal('&emsp; ');
    convert('     ').should.equal('&emsp;&ensp;');
    convert('      ').should.equal('&emsp;&emsp;');
  });
});
