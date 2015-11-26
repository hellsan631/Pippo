#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program       = require('commander');
var path          = require('path');
var Reader        = require('../lib/reader.js');
var fs            = require('fs');
var util          = require('util');

program
  .version('1.0.0')
  .usage('./path/to/advertisers.txt ./path/to/people.txt')
  .option('-o, --output [file]', 'Specify a file to output JSON formated results')
  .option('-a, --advertisers [file]', 'Specify a path for advertisers.txt file')
  .option('-p, --people [file]', 'Specify a path for people.txt file')
  .option('-t, --trial', 'Uses local files inside this repo for test output')
  .parse(process.argv);

if(!program.args.length && !program.trial) {
  program.help();
} else {

  var spinners = {
    result: 'Running Resol Parteo Optimization'
  };

  var multispinner;
  var paths;
  var reader;
  var results;

  console.log(spinners.result);

  setTimeout(function(){
    paths = resolvePaths();

    if (paths) {
      reader = new Reader(paths.ad, paths.people);

      results = reader.resolve();

      if (program.output) {

        fs.writeFileSync(
          program.output,
          JSON.stringify(results, null, 4),
          'utf-8'
        );

      } else {
        console.log(util.inspect(results, {depth: null, colors: true}));
        console.log('\n');
      }

      console.log('Success!');

    } else {
      console.log('Error');
    }
  }, 400);
}

function resolvePaths() {
  var adPath;
  var peoplePath;

  if (program.trial) {
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
