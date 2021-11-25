const fs = require('fs').promises;

const readData = async () => JSON.parse(await fs.readFile('./data/shows.json', 'utf8'));
const writeData = async data => fs.writeFile('./data/shows.json', JSON.stringify(data), 'utf8');

module.exports = {readData, writeData};