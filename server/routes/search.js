const axios = require('axios');
const router = require('express').Router();
const querystring = require('querystring');
const {API_KEY} = process.env;
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

        if (req.query && req.query.page > 0) {
            query.page = req.query.page;
        }
        console.log(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(query)}`);
        const [myShows, {data}] = await Promise.all([
            readShows(req.user.id),
            axios.get(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(query)}`)
        ]);

        const shows = data.results.map(({name, id, poster_path}) => ({
            name,
            id,
            following: myShows.has(id),
            img: poster_path ? `https://image.tmdb.org/t/p/original${poster_path}` : '/images/placeholder.png'
        }));

        res.json(shows);
    } else {
        res.json([]);
    }
});

module.exports = router;