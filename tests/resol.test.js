var Resol = require('../app/main.js');

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

var result = ctr.palio();

console.log(result);
