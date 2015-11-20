exports = module.exports = Pareto;

function Pareto(graph) {
  this.graph = graph;
}

/**
 * Generates a weak Pareto optimum: "The allocation for which there are no possible alternative
 * allocations whose realization would cause every individual to gain". There may be several
 * allocations that are equal in total individual gain but only one is chosen.
 *
 * Results are based on a given graph of 2d data where each 2d point is and object with a score
 * attribute.
 *
 * @returns {object} containing the optimum choices in a given set of graph data.
 */
Pareto.prototype.fronteir = function () {
  var _this = this;

  // We want to keep a fresh copy of the graph data for each different weighted run
  var graph  = _this.deepCopy(_this.graph);

  // Calculates a total number of tries and what each tries weight will be.
  var weight = graph.length;
  var runs   = [];

  while(weight > 0) {

    // Make a copy to refresh the internal graph data from the original graph set
    _this.graph = _this.deepCopy(graph);

    runs.push(_this._run(weight));

    weight--;
  }

  // Just in case we need the data source again in the same function, we make sure it is reset
  _this.graph = _this.deepCopy(graph);

  // Return the optimal solution
  return _this._findOptimum(runs);
};

/**
 * Finds the optimal run out of all of the runs that occured
 *
 * @private
 * @param {array<object>} an array of objects containing the scores of each run
 * @returns {object} containing the best possible run
 */
Pareto.prototype._findOptimum = function(runs) {
  var maxScore = false;

  for(var i = 0; i < runs.length; i++) {
    if (maxScore && maxScore.score < runs[i].score) {
      maxScore = runs[i];
    } else if (!maxScore) {
      maxScore = runs[i];
    }
  }

  return maxScore;
};

/**
 * Goes through each item in the 2d dataset to determine the best choice for each value of X and Y
 *
 * @private
 * @param {number} a weight to multiply against the cost of each choice
 * @returns {object} containing the total score & what the choices for that round were.
 */
Pareto.prototype._run = function(weight) {
  var _this  = this;
  var total  = 0;
  var totals = [];
  var max;
  var maxX;
  var maxY;

  //Step add the cost of choosing a grid item to each graph object
  _this._generateCost(weight);

  /*
   * Since we reduce the graph each run, we want to make sure that there are no boundary issues if
   * the array sizes of advertisers and clients are not the same.
   */
  while (_this.graph.length > 0 && _this.graph[0].length > 0) {
    max = false;
    maxX = false;
    maxY = false;

    // Goes through each element to find the best lowest cost element in the graph to pick next
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

    // After we find the best element and save it, we need to reduce the 2d plane by taking out the
    // all same X and Y values for the maximum choice decided above.
    _this._reduce(maxX, maxY);
  }

  return {
    score:   total,
    choices: totals
  };
};

/**
 * Does a Deep Copy/Clones of an array and returns the clone
 *
 * @private
 * @param {array} the array to clone
 * @returns {array} a deep copy of the array
 */
Pareto.prototype.deepCopy = function(obj) {
  var output = [];
  var len    = obj.length;

  for (var i = 0; i < len; i++) {
    output[i] = obj[i].slice(0);
  }

  return output;
};

/**
 * Reduces the graph when a given value is X,Y is chosen so that the same X and Y
 * may only be chosen once
 *
 * @private
 * @param {number} the x value that needs to be removed from the graph
 * @param {number} the y value that needs to be removed from the graph
 */
Pareto.prototype._reduce = function(x, y) {
  this.graph.splice(x, 1);

  for (var i = 0; i < this.graph.length; i++) {
    this.graph[i].splice(y, 1);
  }
};

/**
 * Generates a cost for each point on the 2d graph and saves the cost to this.graph
 *
 * @private
 * @param {number} a multiplier that increases the importance of the original score vs the cost of choice
 */
Pareto.prototype._generateCost = function(weight) {
  for (var x = 0; x < this.graph.length; x++) {
    for (var y = 0; y < this.graph[x].length; y++) {
      this.graph[x][y].cost = (this.graph[x][y].score * weight) - this._getCost(x, y);
    }
  }
};

/**
 * Gets the cost by adding up every point with the same X and the same Y based on the given X and Y
 *
 * @private
 * @param {number} the target X value on a 2d plane
 * @param {number} the target Y value on a 2d plane
 * @returns {number} total cost associated with choosing the given X and Y value
 */
Pareto.prototype._getCost = function(targetX, targetY) {
  var cost = 0;

  // Goes through everything with the same Y value and adds the score
  for (var x = 0; x < this.graph.length; x++) {
    if (x !== targetX) {
      cost += this.graph[x][targetY].score;
    }
  }

  // Goes through everything with the same X value and adds the score
  for (var y = 0; y < this.graph[targetX].length; y++) {
    if (y !== targetY) {
      cost += this.graph[targetX][y].score;
    }
  }

  return cost;
};
