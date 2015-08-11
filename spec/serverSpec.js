var mocha = require("mocha");
var chai = require("chai");
var assert = require("assert");
var expect = require("chai").expect;

describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });

    it('should do some shit', function(){

      expect(2).to.equal(2);
      
    });
  });
});
