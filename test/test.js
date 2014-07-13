/* global describe, it */
'use strict';

var convert = require('../core');


describe('Core functionality', function () {
  it('should map empty string to itself', function () {
    convert('').should.equal('');
  });

  it('should treat backslash as an escape character');

  it('should support indices and powers syntax', function () {
    convert('1').should.equal('1');
    convert('2^2').should.equal('2<sup>2</sup>');
    convert('2_2').should.equal('2<sub>2</sub>');
    convert('2_{2}').should.equal('2<sub>2</sub>');
    convert('2_{2^2}').should.equal('2<sub>2<sup>2</sup></sub>');
    convert('2_{2^{2}}^2').should.equal('2<sub>2<sup>2</sup></sub><sup>2</sup>');
  });

  it('should preserve newlines');
});


describe('Mathematical bold script', function () {
  it('should replace symbols with corresponding entities');
});


describe('Abstract and common number sets', function () {
  it('should replace symbols with corresponding entities');
});


describe('Arithmetic and logical operators', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('1+1-1').should.equal('1+1&minus;1');
  });

  it('should not replace dashes with minuses in compound words');
});

describe('Comparison relations', function () {
  it('should replace symbols with corresponding entities');
  it('should parse equals/tilde sequences greedily');
});


describe('Inference relations and constants', function () {
  it('should replace symbols with corresponding entities');
  it('should put appropriate spacing on both sides of inference arrows');
  it('should leave "TT" and "BB" as is, if found close to an alphanumeric character');
});


describe('Arrows', function () {
  it('should replace symbols with corresponding entities');
});


describe('"Let" and defining signs', function () {
  it('should replace symbols with corresponding entities');
  it('should put a space after "let"');
});


describe('Various symbols', function () {
  it('should replace symbols with corresponding entities');
  it('should not replace double "o" with infinity inside words');
});


describe('Dashes', function () {
  it('should parse dash sequences greedily', function () {
    convert('-----').should.equal('&mdash;&ndash;');
  });
});


describe('Quotation marks', function () {
  it('should replace symbols with corresponding entities');
  it('should parse lt/gt sequences greedily');
});


describe('Whitespace sequences', function () {
  it('should support thin-space shorthand');
  it('should parse whitespace sequences greedily');
});
