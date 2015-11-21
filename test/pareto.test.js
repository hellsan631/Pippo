import test from 'ava';
import Pareto from '../lib/pareto.js';

test.beforeEach(t => {
  t.context.data = {
    grid: [
      [{score: 11}, {score: 10.5}, {score: 15}],
      [{score: 11}, {score: 7},    {score: 10}],
      [{score: 9},  {score: 6.75}, {score: 11.25}]
    ]
  };

  t.end();
});

test('deepCopy should create a new copy of the original', t => {
  var grid = t.context.data.grid;

  var pareto = new Pareto();

  var copy = pareto.deepCopy(grid);

  copy[0][0].score = 55;

  t.notSame(copy[0][0].score, grid[0][0].score);
  t.end();
});


test('getCost should return the overall cost of the choice', t => {

  var pareto = new Pareto(t.context.data.grid);

  t.same(pareto._getCost(0,0), 45.5);
  t.same(pareto._getCost(0,1), 39.75);
  t.same(pareto._getCost(0,2), 42.75);

  t.end();
});

test('generateCost should return the relative cost of each point on the grid', t => {

  var pareto = new Pareto(t.context.data.grid);

  pareto._generateCost(1);

  t.same(t.context.data.grid[0][0].cost, -34.5);
  t.same(t.context.data.grid[0][1].cost, -29.25);
  t.same(t.context.data.grid[0][2].cost, -27.75);

  t.end();
});

test('generateCost weightings should work', t => {

  var pareto = new Pareto(t.context.data.grid);

  pareto._generateCost(2);

  t.notSame(t.context.data.grid[0][0].cost, -34.5);
  t.notSame(t.context.data.grid[0][1].cost, -29.25);
  t.notSame(t.context.data.grid[0][2].cost, -27.75);

  t.end();
});
