const axios = require('axios');
const router = require('express').Router();
const querystring = require('querystring');
const {API_KEY} = require('../config');
router.get('/', (req, res) => res.send('working'));

router.post('/', (req, res) => {
    const query = {
        query: req.body.query,
        api_key: API_KEY,
        language: 'en-US',
        page: 1,
        include_adult: false
    };

    axios.get(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(query)}`)
        .then(({data}) => {
            const results = data.results.map(({name, id, overview, poster_path}) => ({
                name,
                id,
                overview,
                img: `https://image.tmdb.org/t/p/original${poster_path}`
            }));

            res.json(results);
        });

});

module.exports = router;