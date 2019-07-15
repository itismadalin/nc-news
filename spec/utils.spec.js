const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it("returns a new array when passed an array", () => {
    const input = [];
    const expected = [];
    expect(formatDates(input)).to.eql(expected);
  });
  it("returns an array containing an object with a timestamp, formatted to a human readable date ", () => {
    const input = [{ created_at: 1471522072389 }];
    const expected = [{ created_at: new Date(1471522072389) }];
    expect(formatDates(input)).to.eql(expected);
  });
  it("should return an array containing an object of multiple key value pairs, with a timestamp,formatted to a human readable date", () => {
    const input = [{ title: "MyApp", created_at: 1471522072389 }];
    const expected = [
      { title: "MyApp", created_at: new Date(1471522072389) }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
  it("returns an array of objects, without mutating the original input array", () => {
    const input = [
      { title: "myApp", created_at: 1471522072389 },
      { title: "myApp", created_at: 1481522072389 }
    ];
    const copyInput = [...input];
    const expected = [
      { title: "myApp", created_at: new Date(1471522072389) },
      { title: "myApp", created_at: new Date(1481522072389)}
    ];
    expect(formatDates(input)).to.eql(expected);
    expect(copyInput).to.eql(input);
  });
});

describe('makeRefObj', () => {
  
});

describe('formatComments', () => {
  
});
