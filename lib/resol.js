var Pareto = require('./pareto.js');

exports = module.exports = Resol;

/**
 * The constructor for the Resol class which contains the CTR algorithm as outlined by
 * the lazy stats team.
 *
 * @param {array<string>} a list of advertiser names
 * @param {array<string>} a list of client names
 */
function Resol(advertisers, clients) {
  this.advertisers  = advertisers;
  this.clients      = clients;
}

/**
 * Generates a weak Pareto optimum based on the current set of advertisers and clients
 *
 * @returns {object} containing the best possible run and that runs results
 */
Resol.prototype.pareto = function() {
  var _this = this;
  var graph = [];

  // Creates a 2d graph from each combination of advertiser and client
  _this.advertisers.forEach(function(ad) {
    var values = [];

    _this.clients.forEach(function(client) {
      values.push({
        ad: ad,
        client: client,
        score: _this.combine(ad, client)
      });
    });

    graph.push(values);
  });

  var pareto = new Pareto(graph);

  return pareto.frontier();
};

/**
 * Generates a CTR based on the combination of the client's and advertiser's names.
 *
 * @param {string} the name of a advertiser
 * @param {string} the name of a client
 * @returns {number} the total possible CTR of the given client/advertiser combo
 */
Resol.prototype.combine = function(adver, client) {
  var _this = this;

  var total = 0;

  if (adver.length % 2 === 0) {
    total = _this.countVowels(client) * 1.5;
  } else {
    total = _this.countConsonants(client);
  }

  var commonFactors = _this.countDuplicates(
    _this.findFactors(adver.length),
    _this.findFactors(client.length)
  );

  if (commonFactors > 0) {
    total = total * 1.5;
  }

  return total;
};

/**
 * Counts the vowels in a string
 *
 * @param {string} the name will be counted
 * @returns {number} number of vowels in the string
 */
Resol.prototype.countVowels = function(name) {
  return name.match(/[aeiou]/gi).length;
};

/**
 * Counts the consonants in a string
 *
 * @param {string} the name will be counted
 * @returns {number} number of consonants in the string
 */
Resol.prototype.countConsonants = function(name) {

  //Runs a REGEX to replace all spaces in the string to determine length
  return name.replace(/\s/g, '').length - this.countVowels(name);
};

/**
 * Counts the number of duplicate elements in two arrays
 *
 * @param {array<number>} an array of numbers for duplicate check
 * @param {array<number>} the second array of numbers for duplicate check
 * @returns {number} the count of the total number of duplicates in the two arrays
 */
Resol.prototype.countDuplicates = function(one, two) {
  var count = 0;

  for (var i = 0; i < one.length; i++) {
    for (var k = 0; k < two.length; k++) {
      if (one[i] === two[k]) {
        count++;
      }
    }
  }

  return count;
};

/**
 * Finds the factors for a given number
 *
 * @param {number} the number to calculate the factors from
 * @returns {array<number>} containing all the factors for the given number
 */
Resol.prototype.findFactors = function(number) {
  var factors = [];

  for (var i = 2; i < number; i++) {
    if (number % i === 0){
      factors.push(i);
    }
  }

  return factors;
};
