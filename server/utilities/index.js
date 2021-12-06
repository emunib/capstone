const fs = require('fs').promises;

const readShows = async (user) => {
    const path = `./data/${user}.json`;
    try {
        await fs.access(path);
    } catch (e) {
        await writeShows(user, new Map());
    }

    return JSON.parse(await fs.readFile(path, 'utf8'), reviver);
};
const writeShows = async (user, data) => {
    const path = `./data/${user}.json`;
    return fs.writeFile(path, JSON.stringify(data, replacer), 'utf8');
};


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