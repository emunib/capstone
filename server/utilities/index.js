const fs = require('fs').promises;

const readShows = async () => JSON.parse(await fs.readFile('./data/shows.json', 'utf8'), reviver);
const writeShows = async data => fs.writeFile('./data/shows.json', JSON.stringify(data, replacer), 'utf8');


// https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map
// Map object serialization and parsing
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries())
        };
    } else {
        return value;
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

module.exports = {readShows, writeShows};