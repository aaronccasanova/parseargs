'use strict';

const { parseArgs } = require('./index.js');

const argv = ['--f', 'foo1', '--foo', 'foo2', '--bar', 'baz'];

const parsed = parseArgs(argv, {
  args: {
    foo: {
      short: 'f',
      withValue: true,
      multiples: true,
    },
  },
});

console.log('parsed:', parsed);
