const fs = require('fs').promises;

const readShows = async () => JSON.parse(await fs.readFile('./data/shows.json', 'utf8'));
const writeShows = async data => fs.writeFile('./data/shows.json', JSON.stringify(data), 'utf8');

module.exports = {readShows, writeShows};