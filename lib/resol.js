var Pareto = require('./pareto.js');

exports = module.exports = Resol;

/**
 * The constructor for the Resol class which contains the CTR algorithm as outlined by
 * the lazy stats team.
 *
 * @param {array<string>} a list of advertiser names
 * @param {array<string>} a list of people names
 */
function Resol(advertisers, people) {
  this.advertisers  = advertisers;
  this.people      = people;
}

/**
 * Generates a weak Pareto optimum based on the current set of advertisers and people
 *
 * @returns {object} containing the best possible run and that runs results
 */
Resol.prototype.pareto = function() {
  var _this = this;
  var graph = [];

  // Creates a 2d graph from each combination of advertiser and person
  _this.advertisers.forEach(function(ad) {
    var values = [];

    _this.people.forEach(function(person) {
      values.push({
        ad: ad,
        person: person,
        score: _this.combine(ad, person)
      });
    });

    graph.push(values);
  });

  var pareto = new Pareto(graph);

  return pareto.frontier();
};

/**
 * Generates a CTR based on the combination of the person's and advertiser's names.
 *
 * @param {string} the name of a advertiser
 * @param {string} the name of a person
 * @returns {number} the total possible CTR of the given person/advertiser combo
 */
Resol.prototype.combine = function(adver, person) {
  var _this = this;

  var total = 0;

  if (adver.length % 2 === 0) {
    total = _this.countVowels(person) * 1.5;
  } else {
    total = _this.countConsonants(person);
  }

  var commonFactors = _this.countDuplicates(
    _this.findFactors(adver.length),
    _this.findFactors(person.length)
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

  //Runs a REGEX to replace all other non-alphabetic characters in the string to determine length
  return name.replace(/[^A-Za-z]+/g, '').length - this.countVowels(name);
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
