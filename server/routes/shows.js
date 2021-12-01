const axios = require('axios');
const router = require('express').Router();
const qs = require('querystring');
const {API_KEY} = require('../config');
const {readShows} = require('../utilities');

const query = {
    api_key: API_KEY,
    language: 'en-US',
    page: 1,
    include_adult: false,
    sort_by: 'popularity.desc',
    include_null_first_air_dates: false
};

router.get('/trending', async (req, res) => {
    const [myShows, {data}] = await Promise.all([
        readShows(),
        axios.get(`https://api.themoviedb.org/3/trending/tv/week?${qs.stringify(query)}`)
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


    const [myShows, {data}] = await Promise.all([
        readShows(),
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

module.exports = router;