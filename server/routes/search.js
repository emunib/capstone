const axios = require('axios');
const router = require('express').Router();
const querystring = require('querystring');
const {API_KEY} = require('../config');
const {readShows} = require('../utilities');

router.post('/', async (req, res) => {
    if (req.body.query) {
        const query = {
            query: req.body.query,
            api_key: API_KEY,
            language: 'en-US',
            page: 1,
            include_adult: false
        };

        const [myShows, {data}] = await Promise.all([
            readShows(),
            axios.get(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(query)}`)
        ]);

        const shows = data.results.map(({name, id, overview, poster_path}) => ({
            name,
            id,
            overview,
            // following: myShows.some(show => show.id == id),
            img: `https://image.tmdb.org/t/p/original${poster_path}`
        }));

        res.json(shows);
    } else {
        res.json([]);
    }
});

module.exports = router;