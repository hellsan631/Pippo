var Pareto = require('./pareto.js');

exports = module.exports = Resol;

function Resol(advertisers, clients) {
  this.advertisers  = advertisers;
  this.clients      = clients;
}

Resol.prototype.pareto = function() {
  var _this = this;
  var graph = [];

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

  return pareto.fronteir();
};

Resol.prototype.combine = function(adver, client) {
  var _this = this;

  var total = 0;

  if (adver.length % 2 === 0) {
    total = _this.countVowels(client) * 1.5;
  } else {
    total = _this.countConcents(client);
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

Resol.prototype.countVowels = function(name) {
  return name.match(/[aeiou]/gi).length;
};

Resol.prototype.countConcents = function(name) {
  return name.length - this.countVowels(name);
};

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

Resol.prototype.findFactors = function(number) {
  var factors = [];

  for (var i = 2; i < number; i++) {
    if (number % i === 0){
      factors.push(i);
    }
  }

  return factors;
};
