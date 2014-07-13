/* global describe, it */
'use strict';

var convert = require('../core');


describe('Core functionality', function () {
  it('should map empty string to itself', function () {
    convert('').should.equal('');
  });

  it('should replace indices and powers', function () {
    convert('1').should.equal('1');
    convert('2^2').should.equal('2<sup>2</sup>');
    convert('2_2').should.equal('2<sub>2</sub>');
    convert('2_{2}').should.equal('2<sub>2</sub>');
    convert('2_{2^2}').should.equal('2<sub>2<sup>2</sup></sub>');
    convert('2_{2^{2}}^2').should.equal('2<sub>2<sup>2</sup></sub><sup>2</sup>');
  });
});


describe('Arithmetic and logical operators', function () {
  it('should replace symbols with corresponding entities', function () {
    convert('1+1-1').should.equal('1+1&minus;1');
  });
});


describe('Dashes', function () {
  it('should parse dash sequences greedily', function () {
    convert('-----').should.equal('&mdash;&ndash;');
  });
});
