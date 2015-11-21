exports = module.exports = Pareto;

/**
 * The constructor for the Pareto class which contains the optimization algorithm to find the best
 * combination of advertisers and clients. This is by no means a good algorithm because its like
 * O (n^4), but I'm not a math major, I only needed calc 2, don't judge me, you lazy stats team.
 * Also to note, this might not even be a Pareto Frontier, but I needed a name for it.
 *
 * @param {array<array>} a 2d grid of x vs y where each x and y value has a score object
 */
function Pareto(grid) {
  this.grid = grid;
}

/**
 * Generates a weak Pareto optimum: "The allocation for which there are no possible alternative
 * allocations whose realization would cause every individual to gain". There may be several
 * allocations that are equal in total individual gain but only one is chosen.
 *
 * Results are based on a given grid of 2d data where each 2d point is and object with a score
 * attribute.
 *
 * @returns {object} containing the optimum choices in a given set of grid data.
 */
Pareto.prototype.frontier = function () {
  var _this = this;

  // We want to keep a fresh copy of the grid data for each different weighted run
  var grid  = _this.deepCopy(_this.grid);

  // Calculates a total number of tries and what each tries weight will be.
  var weight = grid.length;
  var runs   = [];

  while(weight > 0) {

    // Make a copy to refresh the internal grid data from the original grid set
    _this.grid = _this.deepCopy(grid);

    runs.push(_this._run(weight));

    weight--;
  }

  // Just in case we need the data source again in the same function, we make sure it is reset
  _this.grid = _this.deepCopy(grid);

  // Return the optimal solution
  return _this._findOptimum(runs);
};

/**
 * Finds the optimal run out of all of the runs that occurred
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

  //Step add the cost of choosing a grid item to each grid object
  _this._generateCost(weight);

  /*
   * Since we reduce the grid each run, we want to make sure that there are no boundary issues if
   * the array sizes of advertisers and clients are not the same.
   */
  while (_this.grid.length > 0 && _this.grid[0].length > 0) {
    max = false;
    maxX = false;
    maxY = false;

    // Goes through each element to find the best lowest cost element in the grid to pick next
    for (var x = 0; x < _this.grid.length; x++) {
      for (var y = 0; y < _this.grid[x].length; y++) {
        if (max && max.cost < _this.grid[x][y].cost) {
          max = _this.grid[x][y];
          maxX = x;
          maxY = y;
        } else if (!max) {
          max = _this.grid[x][y];
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
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Reduces the grid when a given value is X,Y is chosen so that the same X and Y
 * may only be chosen once
 *
 * @private
 * @param {number} the x value that needs to be removed from the grid
 * @param {number} the y value that needs to be removed from the grid
 */
Pareto.prototype._reduce = function(x, y) {
  this.grid.splice(x, 1);

  for (var i = 0; i < this.grid.length; i++) {
    this.grid[i].splice(y, 1);
  }
};

/**
 * Generates a cost for each point on the 2d grid and saves the cost to this.grid
 *
 * @private
 * @param {number} a multiplier for the importance of the original score vs the cost of choice
 */
Pareto.prototype._generateCost = function(weight) {
  for (var x = 0; x < this.grid.length; x++) {
    for (var y = 0; y < this.grid[x].length; y++) {
      this.grid[x][y].cost = (this.grid[x][y].score * weight) - this._getCost(x, y);
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
  for (var x = 0; x < this.grid.length; x++) {
    if (x !== targetX) {
      cost += this.grid[x][targetY].score;
    }
  }

  // Goes through everything with the same X value and adds the score
  for (var y = 0; y < this.grid[targetX].length; y++) {
    if (y !== targetY) {
      cost += this.grid[targetX][y].score;
    }
  }

  return cost;
};
