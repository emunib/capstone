const axios = require('axios');
const querystring = require('querystring');
const Show = require('../database/models/show');
const qs = require('querystring');
const fs = require('fs').promises;
const {API_KEY: api_key} = process.env;

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
            dataType: 'Map', value: Array.from(value.entries())
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

function formatBasicShow({id, name, overview, poster_path, vote_average}, following) {
    return {
        id,
        name,
        overview,
        following,
        img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png',
        rating: vote_average
    };
}

async function formatDetailedShow(show, following) {
    const detailedShow = formatBasicShow(show, following);

    const responses = await Promise.all(show.seasons.map(({season_number}) => axios.get(`https://api.themoviedb.org/3/tv/${show.id}/season/${season_number}?${qs.encode({api_key})}`)));
    detailedShow.seasons = formatSeasons(responses.map(res => res.data), detailedShow.img);

    return detailedShow;
}
function formatSeasons(seasons, showImg) {
    seasons = seasons.map(({id, name, overview, poster_path, season_number, episodes}) => ({
        id,
        name,
        overview,
        episodes,
        img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : showImg,
        seasonNum: season_number
    }));

    if (seasons.length && seasons[0].seasonNum === 0) {
        const [first, ...rest] = seasons;
        seasons = [...rest, first];
    }

    seasons.forEach(season => {
        season.episodes = season.episodes.map(({id, episode_number, air_date, name, overview, still_path}) => ({
            id,
            episodeNum: episode_number,
            date: new Date(air_date.replace(/-/g, '\/')),
            name,
            overview,
            img: still_path ? `https://image.tmdb.org/t/p/original${still_path}` : showImg
        }));
    });

    return seasons;
}



module.exports = {readShows, writeShows, formatBasicShow, formatDetailedShow};