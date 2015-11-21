# Pippo
> A CTR CLI tool for pippo

[![Build Status](https://travis-ci.org/hellsan631/Pippo.svg?branch=master)](https://travis-ci.org/hellsan631/Pippo) [![Coverage Status](https://coveralls.io/repos/hellsan631/Pippo/badge.svg?branch=master&service=github)](https://coveralls.io/github/hellsan631/Pippo?branch=master)

### CLI Installation and Useage

First, install pippo globally:

```shell
npm install -g pippo
```

Next run the pippo command with two local files

```shell
$ resol ./path/to/advertisers.txt ./path/to/people.txt
```

This will generate optimized CTR choices and display them in console. If you want to save the output to a file, then use the -o option in the command line

```shell
$ resol ./path/to/advertisers.txt ./path/to/people.txt -o output.txt
```

### Programatic Useage

If you want to use the Resol library locally in an NPM server or in the browser, then just use npm to install it normally

```shell
npm install pippo --save
```

And include it in your scripts using the require function (requires browserify if your using a browser)

```js
var Resol = require('pippo');

var ctr     = new Resol(advertiserArray, peopleArray);
var results = ctr.resolve();

/* Results:
  {
    choices: [
      {
        ad: "Advertiser Name",
        person: "Person Name",
        score: 15,
        cost: -20
      }
    ],
    score: 15
  }
 */
```
