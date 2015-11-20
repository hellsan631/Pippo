exports = module.exports = Pareto;

function Pareto(graph) {
  this.graph = graph;
}

Pareto.prototype.fronteir = function () {
  var _this = this;
  var graph = _this.deepCopy(_this.graph);

  var weight = graph.length * graph[0].length;

  var trys = [];

  while(weight > 0) {
    _this.graph = _this.deepCopy(graph);

    var results = _this.run(weight);

    trys.push({
      score: results.total,
      choices: results.choices
    });

    weight--;
  }

  var maxScore = false;

  for(var i = 0; i < trys.length; i++) {
    if (maxScore && maxScore.score < trys[i].score) {
      maxScore = trys[i];
    } else if (!maxScore) {
      maxScore = trys[i];
    }
  }

  return maxScore;
};

Pareto.prototype.run = function(weight) {
  var _this = this;
  var total = 0;
  var totals = [];
  var max;
  var maxX;
  var maxY;

  //Step add the cost of choosing a grid item to each graph object
  _this.generateCost(weight);

  /*
   * Since we reduce the graph each run, we want to make sure that there are no boundary issues if
   * the array sizes of advertisers and clients are not the same.
   */

  while (_this.graph.length > 0 && _this.graph[0].length > 0) {
    max = false;
    maxX = false;
    maxY = false;

    for (var x = 0; x < _this.graph.length; x++) {
      for (var y = 0; y < _this.graph[x].length; y++) {
        if (max && max.cost < _this.graph[x][y].cost) {
          max = _this.graph[x][y];
          maxX = x;
          maxY = y;
        } else if (!max) {
          max = _this.graph[x][y];
          maxX = x;
          maxY = y;
        }
      }
    }

    total += max.score;
    totals.push(max);

    _this.reduce(maxX, maxY);
  }

  return {
    total:   total,
    choices: totals
  };
};

Pareto.prototype.deepCopy = function(obj) {
  var output = [];
  var len    = obj.length;

  for (var i = 0 ; i < len; i++) {
    output[i] = obj[i].slice(0);
  }

  return output;
};

Pareto.prototype.reduce = function(x, y) {
  this.graph.splice(x, 1);

  for (var i = 0; i <   this.graph.length; i++) {
    this.graph[i].splice(y, 1);
  }
};

Pareto.prototype.generateCost = function(weight) {
  for (var x = 0; x < this.graph.length; x++) {
    for (var y = 0; y < this.graph[x].length; y++) {
      this.graph[x][y].cost = (this.graph[x][y].score * weight) - this.getCost(x, y);
    }
  }
};

Pareto.prototype.getCost = function(targetX, targetY) {
  var cost = 0;

  for (var x = 0; x < this.graph.length; x++) {
    if (x !== targetX) {
      cost += this.graph[x][targetY].score;
    }
  }

  for (var y = 0; y < this.graph[targetX].length; y++) {
    if (y !== targetY) {
      cost += this.graph[targetX][y].score;
    }
  }

  return cost;
};
