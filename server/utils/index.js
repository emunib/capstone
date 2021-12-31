const axios = require('axios');
const qs = require('querystring');
const fs = require('fs').promises;
const {API_KEY: api_key} = process.env;

function formatBasicShow({id, name, overview, poster_path, vote_average}, following) {
    return {
        id,
        name,
        overview,
        following,
        watched: false,
        img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png',
        rating: vote_average
    };
}

async function getShow(id) {
    const {data} = await axios.get(`https://api.themoviedb.org/3/tv/${id}?${qs.encode({api_key})}`);
    return data;
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
        watched: false,
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
            date: Date.parse(air_date.replace(/-/g, '\/')),
            name,
            overview,
            watched: false,
            img: still_path ? `https://image.tmdb.org/t/p/original${still_path}` : showImg
        }));
    });

    return seasons;
}


module.exports = {getShow, formatBasicShow, formatDetailedShow};