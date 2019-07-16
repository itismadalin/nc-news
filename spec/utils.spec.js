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
    const input = [{ created_at: 190859 }];
    const expected = [{ created_at: new Date(190859) }];
    expect(formatDates(input)).to.eql(expected);
  });
  it("should return an array containing an object of multiple key value pairs, with a timestamp,formatted to a human readable date", () => {
    const input = [{ title: "MyApp", created_at: 190859 }];
    const expected = [
      { title: "MyApp", created_at: new Date(190859) }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
  it("returns an array of objects, without mutating the original input array", () => {
    const input = [
      { title: "myApp", created_at: 190859 },
      { title: "myApp", created_at: 200900 }
    ];
    const copyInput = [...input];
    const expected = [
      { title: "myApp", created_at: new Date(190859) },
      { title: "myApp", created_at: new Date(200900) }
    ];
    expect(formatDates(input)).to.eql(expected);
    expect(copyInput).to.eql(input);
  });
});

describe('makeRefObj', () => {
  it("returns an empty object, when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("returns an object of a key value pair based on passed parameters, when passed an array with one object", () => {
    const input = [{ title: "myApp", article_id: 1 }];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { "myApp": 1 };
    expect(actual).to.eql(expected);
  });
  it("returns an object of a key value pair based on passed parameters, when passed an array of an object with multiple key value pairs", () => {
    const input = [
      {
        article_id: 1,
        title: "myApp",
        topic: "coding",
        author: "Stephen King",
        body: "This is a conding horror book",
        created_at: 190859
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { "myApp": 1 };
    expect(actual).to.eql(expected);
  });
  it("returns an object of key value pairs based on passed parameters, when passed an array of objects with multiple key value pairs", () => {
    const input = [
      {
        article_id: 1,
        title: "myApp",
        topic: "coding"
      },
      {
        article_id: 2,
        title: "myOtherApp",
        topic: "coding"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { "myApp": 1, "myOtherApp": 2 };
    expect(actual).to.eql(expected);
  });
});

describe('formatComments', () => {
  it('returns an empty array when an empty array and an empty object is passed', () => {
    const commentData = [];
    const articleRef = {};
    const actual = formatComments(commentData, articleRef);
    const expected = [];
    expect(actual).to.eql(expected);
  });
  it('returns and new array of formatted comments for passed array of single comments object and reference object', () => {
    const commentData = [
      {
        comments_id: 1,
        body:
          'I have mixed feelings about this book; it is giving me the chills',
        belongs_to: 'sense of Redux',
        created_by: 'fear_and_loathing',
        votes: 99,
        created_at: 190859
      }
    ];
    const articleRef = { 'sense of Redux': 3 };
    const actual = formatComments(commentData, articleRef);
    const expected = [
      {
        comments_id: 1,
        body:
          'I have mixed feelings about this book; it is giving me the chills',
        article_id: 3,
        author: 'fear_and_loathing',
        votes: 99,
        created_at: new Date(190859)
      }
    ];
    expect(actual).to.eql(expected);
  });
});