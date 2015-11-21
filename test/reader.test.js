import test   from 'ava';
import fs     from 'fs';
import path   from 'path';
import Reader from '../lib/reader.js';

test('Convert people file contents to array of strings', t => {
  var reader = new Reader();

  var fileArray = reader._fileToArray(fs.readFileSync('./people.txt'));

  t.same(fileArray[0], "Henderson Alvarez");
  t.same(fileArray.length, 3);
  t.end();
});

test('Convert advertiser file contents to array of strings', t => {
  var reader = new Reader();

  var fileArray = reader._fileToArray(fs.readFileSync('./advertisers.txt'));

  t.same(fileArray[0], "EMC Corporation");
  t.same(fileArray.length, 3);
  t.end();
});

test('Reads files and correctly returns resol.pareto() results', t => {
  var reader  = new Reader('./advertisers.txt', './people.txt');

  var results = reader.resolve();

  t.same(results.score, 30.25);
  t.same(results.choices.length, 3);
  t.end();
});
