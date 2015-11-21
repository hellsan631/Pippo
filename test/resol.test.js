import test from 'ava';
import Resol from '../lib/resol.js';

/**
 * Main scoring algorithm tests
 */

test('Counting vowels in names', t => {
  var ctr = new Resol();

  t.same(ctr.countVowels("Henderson Alvarez"), 6);
  t.same(ctr.countVowels("Jon Lestery"),       3);
  t.same(ctr.countVowels("Troy Tulowitzki"),   5);

  t.end();
});

test('Counting concents in names', t => {
  var ctr = new Resol();

  t.same(ctr.countConsonants("Henderson Alvarez"), 10);
  t.same(ctr.countConsonants("Jon Lester"),        6);
  t.same(ctr.countConsonants("Troy Tulowitzki"),   9);

  t.end();
});

test('Find factors in a names length', t => {
  var ctr = new Resol();

  var clientLen = "Henderson Alvarez".length;
  var adLen     = "EMC Corporation".length;

  t.same(ctr.findFactors(clientLen), []);
  t.same(ctr.findFactors(adLen),     [3,5]);

  t.end();
});

test('Find count of duplicates in two arrays of numbers', t => {
  var ctr = new Resol();

  t.same(ctr.countDuplicates([],       [3,5]),    0);
  t.same(ctr.countDuplicates([3,5],    [3,5]),    2);
  t.same(ctr.countDuplicates([4,5],    [3,5]),    1);
  t.same(ctr.countDuplicates([3,9,10], [3,5]),    1);
  t.same(ctr.countDuplicates([3,9,10], [3,9]),    2);
  t.same(ctr.countDuplicates([3,9],    [3,9,10]), 2);

  t.end();
});

test('Check Resol CTR combined values', t => {
  var ctr = new Resol();

  t.same(ctr.combine("EMC Corporation", "Henderson Alvarez"), 10);
  t.same(ctr.combine("EMC Corporation", "Jon Lester"),        9);
  t.same(ctr.combine("EMC Corporation", "Troy Tulowitzki"),   13.5);

  t.same(ctr.combine("Black & Decker Corp", "Henderson Alvarez"), 10);
  t.same(ctr.combine("Black & Decker Corp", "Jon Lester"),        6);
  t.same(ctr.combine("Black & Decker Corp", "Troy Tulowitzki"),   9);

  t.same(ctr.combine("Berkshire Hathaway", "Henderson Alvarez"), 9);
  t.same(ctr.combine("Berkshire Hathawa", "Jon Lester"),         6);
  t.same(ctr.combine("Berkshire Hathaway", "Troy Tulowitzki"),   11.25);

  t.end();
});

/**
 * Resol Pareto frontier testing
 */

test('Resol Pareto with 3x3 grid', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 30.25);
  t.same(result.choices.length, advertisers.length);
  t.end();
});

test('Resol Pareto with 4x4 grid', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway",
    "Target Corporation"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki",
    "Julio Teheran"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 39.25);
  t.same(result.choices.length, advertisers.length);
  t.end();
});

/**
 * Test non-cubic graph sizes
 */

test('More clients then advertisers shouldn\'t error out', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki",
    "Julio Teheran",
    "Zack Greinke",
    "Tony Watson"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 32.5);
  t.same(result.choices.length, advertisers.length);
  t.end();
});

test('More advertisers then clients shouldn\'t error out', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway",
    "Target Corporation",
    "Pepco Holdings, Inc.",
    "CarMax"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 30.25);
  t.same(result.choices.length, clients.length);
  t.end();
});

/**
 * Test larger grids
 */

test('Resol Pareto with 6x6 grid', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway",
    "Target Corporation",
    "Pepco Holdings, Inc.",
    "CarMax"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki",
    "Julio Teheran",
    "Zack Greinke",
    "Tony Watson"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 54.25);
  t.same(result.choices.length, advertisers.length);
  t.end();
});

test('Resol Pareto with 26x26 grid', t => {
  var advertisers = [
    "EMC Corporation",
    "Black & Decker Corp",
    "Berkshire Hathaway",
    "Target Corporation",
    "Pepco Holdings, Inc.",
    "CarMax",
    "Ecolab Inc.",
    "WellCare Health Plans",
    "L-3 Communications Hldgs.",
    "Aon Corporation",
    "Rite Aid Corporation",
    "Danaher Corporation",
    "Goodyear Tire & Rubber",
    "Casey's General Stores",
    "Jacobs Engineering Group",
    "Tenneco Automotive Inc.",
    "Chesapeake Energy",
    "CH2M Hill",
    "FPL Group Inc",
    "Mattel Inc",
    "Sanmina-SCI Corporation",
    "Reinsurance Group of America",
    "Great Atlantic & Pacific Tea",
    "SAIC",
    "Conseco Inc",
    "The Boeing Company"
  ];

  var clients = [
    "Henderson Alvarez",
    "Jon Lester",
    "Troy Tulowitzki",
    "Julio Teheran",
    "Chipper Jones",
    "Zack Greinke",
    "Tony Watson",
    "Dan Uggla",
    "Craig Kimbrel",
    "Jose Bautista",
    "Starlin Castro",
    "Jordan Zimmermann",
    "Jason Kipnis",
    "Bryce Harper",
    "Felix Hernandez",
    "Pablo Sandoval",
    "Madison Bumgarner",
    "Lance Lynn",
    "Matt Carpenter",
    "Andrew McCutchen",
    "Johnny Cueto",
    "Jose Fernandez",
    "Jesse Crain",
    "Tyson Ross",
    "Carlos Gomez",
    "Rafael Furcal"
  ];

  var ctr = new Resol(advertisers, clients);

  var result = ctr.pareto();

  t.same(result.score, 248.75);
  t.same(result.choices.length, advertisers.length);
  t.end();
});
