/*
 *  Node.js test runner for running data-*.js tests with Jint REPL.
 *
 *  Reports discrepancies to console; fix them manually in data-*.js files.
 *  Expects a Jint.Repl executable in 'jint' directory.  Example:
 *
 *    $ node jint.js ---bin ./jint/Jint.Repl.exe --suite suitename
 * 
 *  suitename can be 'all'
 */

var child_process = require('child_process');
var console = require('console');
var runner_support = require('./runner_support');

var argv = require('yargs/yargs')(process.argv.slice(2))
    .option('bin', {
        alias: 'b',
        type: 'string'
    })
    .option('test', {
        alias: 't',
        type: 'string',
        describe: 'Name of the test to run'
    })
    .option('suite', {
        alias: 's',
        type: 'string',
        choices: ['all', 'es5', 'es6', 'es2016plus', 'esintl', 'esnext', 'non-standard'],
        default: 'all'
    })
    .option('bail', {
        type: 'boolean',
        describe: 'Bail of first outdated test'
    })
    .argv;

var jintCommand = argv.bin || './jint/Jint.Repl.exe';
var suites = argv.suite;
suites = suites === 'all' ? '' : suites;

var jintKey = (function () {
    return 'jint3b';
})();
console.log('Jint result key is: test.res.' + jintKey);

function jintRunner(testFilename) {
    try {
        var stdout = child_process.execFileSync(jintCommand, [testFilename], {
            encoding: 'utf-8',
            stdio: 'pipe',
        });

        return /^\[SUCCESS\]$/m.test(stdout);
    } catch (e) {
        return false;
    }
}

runner_support.runTests(jintRunner, jintKey, 'Jint', { suites: suites, testName: argv.test, bail: argv.bail });
