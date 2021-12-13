const axios = require('axios');
const router = require('express').Router();
const querystring = require('querystring');
const {API_KEY} = process.env;
const {formatBasicShow} = require('../utils');
const Show = require('../database/models/show');

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

        const {data: {results}} = await axios.get(`https://api.themoviedb.org/3/search/tv?${querystring.stringify(query)}`);
        const followed = await Promise.all(results.map(show => Show.exists({show_id: show.id})));

        const formatted = results.map((show, i) => formatBasicShow(show, followed[i]));

        res.json(formatted);
    } else {
        res.json([]);
    }
});

module.exports = router;