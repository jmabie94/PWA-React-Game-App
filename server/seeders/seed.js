const db = require('../config/connection');
const { User, Game, Session } = require('../models');
const userSeeds = require('./userSeeds.json');
const gameSeeds = require('./gameSeeds.json');

db.once('open', async () => {
  try {
    await Session.deleteMany({});
    await Game.create(gameSeeds);    
    await User.create(userSeeds);
  } 
  catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
