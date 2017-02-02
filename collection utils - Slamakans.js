/*
 * Made by Slamakans
 * Feel free to make improvements, I just managed to get it working (I THINK)
 *
 * Can be converted to work for Map by just replacing Collection with Map probably, and removing the require.
 */

const { Collection } = require('discord.js');
const fs = require('fs');

/* Any promisification will do probably */
const { promisify } = require('./misc.js');

const isConvertable = obj => obj instanceof Array && obj.every(e => e instanceof Array && e.length === 2);
const hasConvertableElement = obj => obj instanceof Array &&
  (!!obj.find(isConvertable) || !!obj.find(hasConvertableElement));

/* Works with nested collections */
module.exports = {
  writeCollection: async (location, collection) => {
    const recurse = (e, key) => {
      if (e instanceof Collection && !e.find(c => c instanceof Collection)) {
        return key ? [key, [...e.entries()]] : [...e.entries()];
      } else if ((e instanceof Collection || e instanceof Array) && e.find(c => c instanceof Collection)) {
        return e.map(recurse);
      } else {
        return key ? [key, e] : e;
      }
    };

    const converted = recurse(collection);

    return promisify(fs.writeFile)(location, JSON.stringify(converted));
  },
  readCollection: async location => {
    const json = await promisify(fs.readFile)(location, 'utf8');
    const data = JSON.parse(json);

    const recurse = e => {
      if (hasConvertableElement(e)) {
        const result = e.map(recurse);

        return isConvertable(result) ? new Collection(result) : result;
      } else if (isConvertable(e)) {
        return new Collection(e);
      }

      return e;
    };

    return recurse(data);
  },
};

/* Unit test
const { Collection } = require('discord.js');
const { writeCollection, readCollection } = require('../utils/CollectionFunctions.js');

const chai = require('chai');
const expect = chai.expect;

const fs = require('fs');

describe('Collection Read & Write', () => {
  const nonNestedCollection = new Collection([['foo', 'bar'], ['cool', 'car']]);
  it(', writing non-nested', async () => {
    return writeCollection('collection.json', nonNestedCollection);
  });

  it(', reading non-nested', async () => {
    const collection = await readCollection('collection.json');
    expect(collection.equals(nonNestedCollection)).to.equal(true);
  });

  const nestedCollection = new Collection([
    ['foo', new Collection([['bar', 'call']])],
    ['a', new Collection([['b', 'c']])]
  ]);
  it(', writing nested', async () => {
    await writeCollection('nested_collection.json', nestedCollection);
    const data = fs.readFileSync('nested_collection.json', 'utf8');
    expect(data).to.equal('[["foo",[["bar","call"]]],["a",[["b","c"]]]]');
  });

  it(', reading nested', async () => {
    const collection = await readCollection('nested_collection.json');
    expect(collection.equals(nestedCollection)).to.equal(true);
  });

  const nonPureNestedCollection = new Collection([
    ['a', { meme: 3 }],
    ['b', new Collection([['c', { hmm: 'thunker', real: { thinking: 'face' } }]])]
  ]);
  it(', writing non-pure nested', async() => {
    await writeCollection('non-pure_nested_collection.json', nonPureNestedCollection);
    const data = fs.readFileSync('non-pure_nested_collection.json', 'utf8');
    expect(data).to.equal('[["a",{"meme":3}],["b",[["c",{"hmm":"thunker","real":{"thinking":"face"}}]]]]');
  });

  const i = require('util').inspect;
  it(', reading non-pure nested', async() => {
    const collection = await readCollection('non-pure_nested_collection.json');
    expect(collection.equals(nonPureNestedCollection)).to.equal(true);
  });
});
*/
