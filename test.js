var assert = require('assert'),
    convert = require('./core');

assert.equal(convert(''), '');
assert.equal(convert('1'), '1');
assert.equal(convert('2^2'), '2<sup>2</sup>');
assert.equal(convert('2_2'), '2<sub>2</sub>');
assert.equal(convert('2_{2}'), '2<sub>2</sub>');
assert.equal(convert('2_{2^2}'), '2<sub>2<sup>2</sup></sub>');
assert.equal(convert('2_{2^{2}}^2'), '2<sub>2<sup>2</sup></sub><sup>2</sup>');
assert.equal(convert('1+1-1'), '1+1&minus;1');
assert.equal(convert('-----'), '&mdash;&ndash;');
