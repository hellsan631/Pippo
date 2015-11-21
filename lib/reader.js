var fs    = require('fs');
var Resol = require('./resol.js');

exports = module.exports = Reader;

/**
 * The constructor for the command-line file reader
 *
 * @param {string} the path to the advertisers file location
 * @param {string} the path to the clients file location
 */
function Reader(advertiserPath, clientPath) {
  this.advertiserPath = advertiserPath;
  this.clientPath     = clientPath;
}

/**
 * Reads the file paths and runs the Resol.pareto() method to generate a optimal selection
 * of advertisers and their clients to generate the most possible CTR
 *
 * @returns {object} containing the best possible run and that runs results
 */
Reader.prototype.resolve = function() {
  var _this = this;

  var _advertisers = _this._fileToArray(fs.readFileSync(_this.advertiserPath));
  var _clients     = _this._fileToArray(fs.readFileSync(_this.clientPath));

  var resolved = new Resol(_advertisers, _clients);

  return resolved.pareto();
};

/**
 * Converts a single file string to an array of strings
 *
 * @param {object<file>} the file contents as read from fs.readFile
 * @returns {array<string>} contains each line in the file
 */
Reader.prototype._fileToArray = function(data) {

  /*
   * Converts object to string
   * Replaces '\r\n' in files 
   * Splits the string by '\n'
   * Removes any empty strings in the array
   */
  var fileArray = data
    .toString()
    .replace('\r\n', '\n')
    .split('\n')
    .filter(Boolean);

  return fileArray;
};
