const axios = require('axios');
const router = require('express').Router();
const qs = require('querystring');
const {API_KEY} = process.env;
const {readShows, formatBasicShow, getFormattedShows} = require('../utils');
const Show = require('../database/models/show');
const querystring = require('querystring');

const query = {
    api_key: API_KEY,
    language: 'en-US',
    page: 1,
    include_adult: false,
    sort_by: 'popularity.desc',
    include_null_first_air_dates: false
};

router.post('/search', async (req, res) => {
    if (req.body.query) {
        const searchQuery = {...query, query: req.body.query};

        if (req.query && req.query.page > 0) {
            searchQuery.page = req.query.page;
        }

        res.json(await getFormattedShows(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(searchQuery)}`, req.user.id));
    } else {
        res.json([]);
    }
});

router.get('/trending', async (req, res) => {
    const trendingQuery = {...query};

    if (req.query && req.query.page > 0) {
        trendingQuery.page = req.query.page;
    }

    res.json(await getFormattedShows(`https://api.themoviedb.org/3/trending/tv/week?${qs.encode(trendingQuery)}`, req.user.id));
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

    res.json(await getFormattedShows(`https://api.themoviedb.org/3/discover/tv?${qs.encode(topQuery)}`, req.user.id));
});

router.get('/:id', async (req, res) => {
    const showId = parseInt(req.params.id);

    const [following, {data: show}] = await Promise.all([Show.exists({
        user_id: req.user.id,
        show_id: showId
    }), axios.get(`https://api.themoviedb.org/3/tv/${showId}?${qs.encode(query)}`)]);

    res.json(formatBasicShow(show, following));
});

router.get('/:id/seasons', async (req, res) => {
    const showId = parseInt(req.params.id);

    const {data: show} = await axios.get(`https://api.themoviedb.org/3/tv/${showId}?${qs.encode(query)}`);

    let seasons = show.seasons.map(season => ({
        id: season.id,
        name: season.name,
        overview: season.overview,
        img: season.poster_path, // TODO: PLACEHOLDER
        seasonNum: season.season_number
    }));

    if (seasons.length && seasons[0].seasonNum === 0) {
        const [first, ...rest] = seasons;
        seasons = [...rest, first];
    }

    res.json(seasons);
});

router.get('/:id/seasons/:num/episodes', async (req, res) => {
    const showId = parseInt(req.params.id);
    const seasonNum = parseInt(req.params.num);

    const {data: season} = await axios.get(`https://api.themoviedb.org/3/tv/${showId}/season/${seasonNum}?${qs.encode(query)}`);

    res.json(season.episodes.map(episode => ({
        id: episode.id,
        episodeNum: episode.episode_number,
        date: Date.parse(episode.air_date.replace(/-/g, '\/')),
        name: episode.name,
        overview: episode.overview,
        img: `https://image.tmdb.org/t/p/original${episode.still_path}` // TODO: PLACEHOLDER
    })));
});

module.exports = router;