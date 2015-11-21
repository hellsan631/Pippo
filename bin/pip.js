#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var path    = require('path');

program
  .version('1.0.0')
  .usage('path/to/advertisers.txt path/to/clients.txt')
  .option('-a, --advertisers [file]', 'Path to advertisers.txt file')
  .option('-p, --people [file]', 'Path to people.txt file')
  .option('-l, --local', 'Uses local files inside this repo')
  .parse(process.argv);

if(!program.args.length && !program.local) {
  program.help();
} else {
  var paths = resolvePaths();

  if (paths) {
    console.log(paths);
  }
}

function resolvePaths() {
  var adPath;
  var clientPath;

  if (program.local) {
    adPath      = path.resolve(__dirname, '..', 'advertisers.txt');
    clientPath  = path.resolve(__dirname, '..', 'people.txt');
  } else {
    if (program.advertisers) {
      adPath = program.advertisers;
    } else if(program.args[0]){
      adPath = program.args[0];
    }

    if (program.clients) {
      clientPath = program.clients;
    } else if(program.args[1]) {
      clientPath = program.args[1];
    }
  }

  if(!adPath) {
    return console.log('You must supply a path to advertisers.txt file. Try --help for more info');
  }

  if(!clientPath) {
    return console.log('You must supply a path to clients.txt file. Try --help for more info');
  }

  return {
    ad: adPath,
    client: clientPath
  };
}
