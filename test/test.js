/* global describe, it */
'use strict';

var assert = require('assert'),
    convert = require('../core');


describe('Core functionality', function () {
  it('should map empty string to itself', function () {
    assert.equal(convert(''), '');
  });

  it('should replace indices and powers', function () {
    assert.equal(convert('1'), '1');
    assert.equal(convert('2^2'), '2<sup>2</sup>');
    assert.equal(convert('2_2'), '2<sub>2</sub>');
    assert.equal(convert('2_{2}'), '2<sub>2</sub>');
    assert.equal(convert('2_{2^2}'), '2<sub>2<sup>2</sup></sub>');
    assert.equal(convert('2_{2^{2}}^2'), '2<sub>2<sup>2</sup></sub><sup>2</sup>');
  });
});


describe('Arithmetic and logical operators', function () {
  it('should replace symbols with corresponding entities', function () {
    assert.equal(convert('1+1-1'), '1+1&minus;1');
  });
});


describe('Dashes', function () {
  it('should parse dash sequences greedily', function () {
    assert.equal(convert('-----'), '&mdash;&ndash;');
  });
});
