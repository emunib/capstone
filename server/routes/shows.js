const axios = require('axios');
const router = require('express').Router();
const qs = require('querystring');
const {API_KEY} = require('../config');
const {readShows} = require('../utilities');
const baseURL = 'https://api.themoviedb.org/3/tv/';

const query = {
    api_key: API_KEY,
    language: 'en-US',
    page: 1,
    include_adult: false,
    sort_by: 'popularity.desc',
    include_null_first_air_dates: false
};

router.get('/trending', async (req, res) => {
    const trendingQuery = {...query};
    if (req.query && req.query.page > 0) {
        trendingQuery.page = req.query.page;
    }
    const [myShows, {data}] = await Promise.all([
        readShows(req.user.id),
        axios.get(`https://api.themoviedb.org/3/trending/tv/week?${qs.stringify(trendingQuery)}`)
    ]);

    const shows = data.results.map(({name, id, overview, poster_path}) => ({
        name,
        id,
        overview,
        following: myShows.has(id),
        img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png'
    }));

    res.json(shows);
});

router.get('/top', async (req, res) => {
    const topQuery = {
        ...query,
        'vote_count.gte': 1000,
        'vote_average.gte': 8
    };

    if (req.query && req.query.page > 0) {
        topQuery.page = req.query.page;
    }

    const [myShows, {data}] = await Promise.all([
        readShows(req.user.id),
        axios.get(`https://api.themoviedb.org/3/discover/tv?${qs.stringify(topQuery)}`)
    ]);


    const shows = data.results.map(({name, id, poster_path}) => ({
        name,
        id,
        following: myShows.has(id),
        img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png'
    }));

    res.json(shows);
});
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const show = await createShow(req.user, id);
    res.json(show);
});

async function createShow(user, id) {
    const {data} = await axios.get(`${baseURL}${id}?${qs.encode(query)}`);
    const followingShows = await readShows(user.id);

    const show = {
        id: data.id,
        name: data.name,
        overview: data.overview,
        watched: followingShows.has(data.id) && followingShows.get(data.id).watched,
        following: followingShows.has(data.id),
        numSeasons: data.number_of_seasons,
        numEpisodes: data.number_of_episodes,
        img: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '/images/placeholder.png'
    };

    let seasonData = await Promise.all(data.seasons.map(async season => ({
        id: season.id,
        name: season.name,
        overview: season.overview,
        watched: await isSeasonWatched(user, show.id, season.season_number),
        seasonNum: season.season_number,
        numEpisodes: season.episode_count,
        img: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : show.img
    })));

    // if the show has a season 0 for specials move it to the end
    if (seasonData.length && seasonData[0].seasonNum === 0) {
        const [first, ...rest] = seasonData;
        seasonData = [...rest, first];
    }

    show.seasons = seasonData;

    for (let season of show.seasons) { // TODO: USE PROMISE.ALL
        season.episodes = await getEpisodes(user, id, season.seasonNum, season.img);
    }

    return show;
}

async function getEpisodes(user, id, num, img) {
    const {data} = await axios.get(`${baseURL}${id}/season/${num}?${qs.encode(query)}`);

    return await Promise.all(data.episodes.map(async ep => ({
        id: ep.id,
        episodeNum: ep.episode_number,
        date: Date.parse(ep.air_date.replace(/-/g, '\/')),
        name: ep.name,
        overview: ep.overview,
        watched: await isEpisodeWatched(user, id, num, ep.episode_number),
        img: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : img
    })));
}

async function isSeasonWatched(user, id, num) {
    const followingShows = await readShows(user.id);
    if (!followingShows.has(id)) return false;
    if (!followingShows.get(id).seasons.has(num)) return false;
    return followingShows.get(id).seasons.get(num).watched;
}

async function isEpisodeWatched(user, id, sNum, epNum) {
    const followingShows = await readShows(user.id);
    if (!followingShows.has(id)) return false;
    if (!followingShows.get(id).seasons.has(sNum)) return false;
    if (!followingShows.get(id).seasons.get(sNum).episodes.has(epNum)) return false;
    return followingShows.get(id).seasons.get(sNum).episodes.get(epNum).watched;
}

module.exports = router;