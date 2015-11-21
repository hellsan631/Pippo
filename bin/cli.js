#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program       = require('commander');
var path          = require('path');
var Reader        = require('../lib/reader.js');
var fs            = require('fs');
var util          = require('util');
var Multispinner  = require('Multispinner');

program
  .version('1.0.0')
  .usage('./path/to/advertisers.txt ./path/to/people.txt')
  .option('-o, --output [file]', 'Specify a file to output JSON formated results')
  .option('-a, --advertisers [file]', 'Specify a path for advertisers.txt file')
  .option('-p, --people [file]', 'Specify a path for people.txt file')
  .option('-l, --local', 'Uses local files inside this repo')
  .parse(process.argv);

if(!program.args.length && !program.local) {
  program.help();
} else {

  var spinners = {
    'result': 'Running Resol Parteo Optimization'
  };

  var multispinner = new Multispinner(spinners);
  var paths;
  var reader;
  var results;

  setTimeout(function(){
    paths = resolvePaths();

    if (paths) {
      reader = new Reader(paths.ad, paths.people);

      results = reader.resolve();
      multispinner.success('result');

      if (program.output) {

        fs.writeFileSync(
          program.output,
          JSON.stringify(results, null, 4),
          'utf-8'
        );

      } else {
        console.log(util.inspect(results, {depth: null, colors: true}));
      }

    } else {
      multispinner.error('result');
    }
  });
}

function resolvePaths() {
  var adPath;
  var peoplePath;

  if (program.local) {
    adPath      = path.resolve(__dirname, '..', 'advertisers.txt');
    peoplePath  = path.resolve(__dirname, '..', 'people.txt');
  } else {
    if (program.advertisers) {
      adPath = program.advertisers;
    } else if(program.args[0]){
      adPath = program.args[0];
    }

    if (program.people) {
      peoplePath = program.people;
    } else if(program.args[1]) {
      peoplePath = program.args[1];
    }
  }

  if(!adPath) {
    return console.log('You must supply a path to advertisers.txt file. Try --help for more info');
  }

  if(!peoplePath) {
    return console.log('You must supply a path to people.txt file. Try --help for more info');
  }

  return {
    ad: adPath,
    people: peoplePath
  };
}
