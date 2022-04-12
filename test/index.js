'use strict';
/* eslint max-len: 0 */

const test = require('tape');
const { parseArgs } = require('../index.js');

// Test results are as we expect

test('when short option used as flag then stored as flag', (t) => {
  const passedArgs = ['-f'];
  const expected = { values: { f: true }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs });

  t.deepEqual(args, expected);

  t.end();
});

test('when short option used as flag before positional then stored as flag and positional (and not value)', (t) => {
  const passedArgs = ['-f', 'bar'];
  const expected = { values: { f: true }, positionals: [ 'bar' ] };
  const args = parseArgs({ strict: false, args: passedArgs });

  t.deepEqual(args, expected);

  t.end();
});

test('when short option `type: "string"` used with value then stored as value', (t) => {
  const passedArgs = ['-f', 'bar'];
  const passedOptions = { f: { type: 'string' } };
  const expected = { values: { f: 'bar' }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('when short option listed in short used as flag then long option stored as flag', (t) => {
  const passedArgs = ['-f'];
  const passedOptions = { foo: { short: 'f', type: 'boolean' } };
  const expected = { values: { foo: true }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('when short option listed in short and long listed in `type: "string"` and used with value then long option stored as value', (t) => {
  const passedArgs = ['-f', 'bar'];
  const passedOptions = { foo: { short: 'f', type: 'string' } };
  const expected = { values: { foo: 'bar' }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('when short option `type: "string"` used without value then stored as flag', (t) => {
  const passedArgs = ['-f'];
  const passedOptions = { f: { type: 'string' } };
  const expected = { values: { f: true }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('short option group behaves like multiple short options', (t) => {
  const passedArgs = ['-rf'];
  const passedOptions = { };
  const expected = { values: { r: true, f: true }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('short option group does not consume subsequent positional', (t) => {
  const passedArgs = ['-rf', 'foo'];
  const passedOptions = { };
  const expected = { values: { r: true, f: true }, positionals: ['foo'] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });
  t.deepEqual(args, expected);

  t.end();
});

// See: Guideline 5 https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html
test('if terminal of short-option group configured `type: "string"`, subsequent positional is stored', (t) => {
  const passedArgs = ['-rvf', 'foo'];
  const passedOptions = { f: { type: 'string' } };
  const expected = { values: { r: true, v: true, f: 'foo' }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });
  t.deepEqual(args, expected);

  t.end();
});

test('handles short-option groups in conjunction with long-options', (t) => {
  const passedArgs = ['-rf', '--foo', 'foo'];
  const passedOptions = { foo: { type: 'string' } };
  const expected = { values: { r: true, f: true, foo: 'foo' }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });
  t.deepEqual(args, expected);

  t.end();
});

test('handles short-option groups with "short" alias configured', (t) => {
  const passedArgs = ['-rf'];
  const passedOptions = { remove: { short: 'r', type: 'boolean' } };
  const expected = { values: { remove: true, f: true }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });
  t.deepEqual(args, expected);

  t.end();
});

test('Everything after a bare `--` is considered a positional argument', (t) => {
  const passedArgs = ['--', 'barepositionals', 'mopositionals'];
  const expected = { values: {}, positionals: ['barepositionals', 'mopositionals'] };
  const args = parseArgs({ args: passedArgs });

  t.deepEqual(args, expected, 'testing bare positionals');

  t.end();
});

test('args are true', (t) => {
  const passedArgs = ['--foo', '--bar'];
  const expected = { values: { foo: true, bar: true }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs });

  t.deepEqual(args, expected, 'args are true');

  t.end();
});

test('arg is true and positional is identified', (t) => {
  const passedArgs = ['--foo=a', '--foo', 'b'];
  const expected = { values: { foo: true }, positionals: ['b'] };
  const args = parseArgs({ strict: false, args: passedArgs });

  t.deepEqual(args, expected, 'arg is true and positional is identified');

  t.end();
});

test('args equals are passed `type: "string"`', (t) => {
  const passedArgs = ['--so=wat'];
  const passedOptions = { so: { type: 'string' } };
  const expected = { values: { so: 'wat' }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'arg value is passed');

  t.end();
});

test('when args include single dash then result stores dash as positional', (t) => {
  const passedArgs = ['-'];
  const expected = { values: { }, positionals: ['-'] };
  const args = parseArgs({ args: passedArgs });

  t.deepEqual(args, expected);

  t.end();
});

test('zero config args equals are parsed as if `type: "string"`', (t) => {
  const passedArgs = ['--so=wat'];
  const passedOptions = { };
  const expected = { values: { so: 'wat' }, positionals: [] };
  const args = parseArgs({ strict: false, args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'arg value is passed');

  t.end();
});

test('same arg is passed twice `type: "string"` and last value is recorded', (t) => {
  const passedArgs = ['--foo=a', '--foo', 'b'];
  const passedOptions = { foo: { type: 'string' } };
  const expected = { values: { foo: 'b' }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'last arg value is passed');

  t.end();
});

test('args equals pass string including more equals', (t) => {
  const passedArgs = ['--so=wat=bing'];
  const passedOptions = { so: { type: 'string' } };
  const expected = { values: { so: 'wat=bing' }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'arg value is passed');

  t.end();
});

test('first arg passed for `type: "string"` and "multiple" is in array', (t) => {
  const passedArgs = ['--foo=a'];
  const passedOptions = { foo: { type: 'string', multiple: true } };
  const expected = { values: { foo: ['a'] }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'first multiple in array');

  t.end();
});

test('args are passed `type: "string"` and "multiple"', (t) => {
  const passedArgs = ['--foo=a', '--foo', 'b'];
  const passedOptions = {
    foo: {
      type: 'string',
      multiple: true,
    },
  };
  const expected = { values: { foo: ['a', 'b'] }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected, 'both arg values are passed');

  t.end();
});

test('when expecting `multiple:true` boolean option and option used multiple times then result includes array of booleans matching usage', (t) => {
  const passedArgs = ['--foo', '--foo'];
  const passedOptions = {
    foo: {
      type: 'boolean',
      multiple: true,
    },
  };
  const expected = { values: { foo: [true, true] }, positionals: [] };
  const args = parseArgs({ args: passedArgs, options: passedOptions });

  t.deepEqual(args, expected);

  t.end();
});

test('order of option and positional does not matter (per README)', (t) => {
  const passedArgs1 = ['--foo=bar', 'baz'];
  const passedArgs2 = ['baz', '--foo=bar'];
  const passedOptions = { foo: { type: 'string' } };
  const expected = { values: { foo: 'bar' }, positionals: ['baz'] };

  t.deepEqual(parseArgs({ args: passedArgs1, options: passedOptions }), expected, 'option then positional');
  t.deepEqual(parseArgs({ args: passedArgs2, options: passedOptions }), expected, 'positional then option');

  t.end();
});

test('correct default args when use node -p', (t) => {
  const holdArgv = process.argv;
  process.argv = [process.argv0, '--foo'];
  const holdExecArgv = process.execArgv;
  process.execArgv = ['-p', '0'];
  const result = parseArgs({ strict: false });

  const expected = { values: { foo: true },
                     positionals: [] };
  t.deepEqual(result, expected);

  t.end();
  process.argv = holdArgv;
  process.execArgv = holdExecArgv;
});

test('correct default args when use node --print', (t) => {
  const holdArgv = process.argv;
  process.argv = [process.argv0, '--foo'];
  const holdExecArgv = process.execArgv;
  process.execArgv = ['--print', '0'];
  const result = parseArgs({ strict: false });

  const expected = { values: { foo: true },
                     positionals: [] };
  t.deepEqual(result, expected);

  t.end();
  process.argv = holdArgv;
  process.execArgv = holdExecArgv;
});

test('correct default args when use node -e', (t) => {
  const holdArgv = process.argv;
  process.argv = [process.argv0, '--foo'];
  const holdExecArgv = process.execArgv;
  process.execArgv = ['-e', '0'];
  const result = parseArgs({ strict: false });

  const expected = { values: { foo: true },
                     positionals: [] };
  t.deepEqual(result, expected);

  t.end();
  process.argv = holdArgv;
  process.execArgv = holdExecArgv;
});

test('correct default args when use node --eval', (t) => {
  const holdArgv = process.argv;
  process.argv = [process.argv0, '--foo'];
  const holdExecArgv = process.execArgv;
  process.execArgv = ['--eval', '0'];
  const result = parseArgs({ strict: false });

  const expected = { values: { foo: true },
                     positionals: [] };
  t.deepEqual(result, expected);

  t.end();
  process.argv = holdArgv;
  process.execArgv = holdExecArgv;
});

test('correct default args when normal arguments', (t) => {
  const holdArgv = process.argv;
  process.argv = [process.argv0, 'script.js', '--foo'];
  const holdExecArgv = process.execArgv;
  process.execArgv = [];
  const result = parseArgs({ strict: false });

  const expected = { values: { foo: true },
                     positionals: [] };
  t.deepEqual(result, expected);

  t.end();
  process.argv = holdArgv;
  process.execArgv = holdExecArgv;
});

test('excess leading dashes on options are retained', (t) => {
  // Enforce a design decision for an edge case.
  const passedArgs = ['---triple'];
  const passedOptions = { };
  const expected = {
    values: { '-triple': true },
    positionals: []
  };
  const result = parseArgs({ strict: false, args: passedArgs, options: passedOptions });

  t.deepEqual(result, expected, 'excess option dashes are retained');

  t.end();
});

// Test bad inputs

test('invalid argument passed for options', (t) => {
  const passedArgs = ['--so=wat'];
  const passedOptions = 'bad value';

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });

  t.end();
});

test('then type property missing for option then throw', (t) => {
  const knownOptions = { foo: { } };

  t.throws(() => { parseArgs({ options: knownOptions }); }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });

  t.end();
});

test('boolean passed to "type" option', (t) => {
  const passedArgs = ['--so=wat'];
  const passedOptions = { foo: { type: true } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });

  t.end();
});

test('invalid union value passed to "type" option', (t) => {
  const passedArgs = ['--so=wat'];
  const passedOptions = { foo: { type: 'str' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });

  t.end();
});

// Test strict mode

test('unknown long option --bar', (t) => {
  const passedArgs = ['--foo', '--bar'];
  const passedOptions = { foo: { type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_UNKNOWN_OPTION'
  });

  t.end();
});

test('unknown short option -b', (t) => {
  const passedArgs = ['--foo', '-b'];
  const passedOptions = { foo: { type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_UNKNOWN_OPTION'
  });

  t.end();
});

test('unknown option -r in short option group -bar', (t) => {
  const passedArgs = ['-bar'];
  const passedOptions = { b: { type: 'boolean' }, a: { type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_UNKNOWN_OPTION'
  });

  t.end();
});

test('unknown option with explicit value', (t) => {
  const passedArgs = ['--foo', '--bar=baz'];
  const passedOptions = { foo: { type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_UNKNOWN_OPTION'
  });

  t.end();
});

test('string option used as boolean', (t) => {
  const passedArgs = ['--foo'];
  const passedOptions = { foo: { type: 'string' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_OPTION_VALUE'
  });

  t.end();
});

test('boolean option used with value', (t) => {
  const passedArgs = ['--foo=bar'];
  const passedOptions = { foo: { type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_OPTION_VALUE'
  });

  t.end();
});

test('invalid short option length', (t) => {
  const passedArgs = [];
  const passedOptions = { foo: { short: 'fo', type: 'boolean' } };

  t.throws(() => { parseArgs({ args: passedArgs, options: passedOptions }); }, {
    code: 'ERR_INVALID_ARG_VALUE'
  });

  t.end();
});
