const axios = require('axios');
const router = require('express').Router();
const qs = require('querystring');
const {API_KEY} = process.env;
const {formatBasicShow, formatDetailedShow, getShow} = require('../utils');
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
        ...query, 'vote_count.gte': 1000, 'vote_average.gte': 8
    };

    if (req.query && req.query.page > 0) {
        topQuery.page = req.query.page;
    }

    res.json(await getFormattedShows(`https://api.themoviedb.org/3/discover/tv?${qs.encode(topQuery)}`, req.user.id));
});

router.get('/:id', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.params.id);

    const [followedShow, show] = await Promise.all([
        Show.findOne({userId, showId}).exec(),
        formatDetailedShow(await getShow(showId), false)
    ]);
    if (!followedShow) {
        res.json(show);
    } else {
        const followedEps = [];
        followedShow.data.seasons.forEach(({episodes}) => episodes.forEach(({id, watched}) => followedEps.push({
            id,
            watched
        })));

        show.seasons.forEach(season => {
            season.episodes.forEach(ep => {
                const followedEp = followedEps.find(fEp => fEp.id === ep.id);
                ep.watched = followedEp ? followedEp.watched : false;
            });
            season.watched = season.episodes.filter(ep => !ep.date || ep.date <= Date.now()).every(ep => ep.watched);
        });

        show.watched = show.seasons.every(s => s.watched);
        show.following = true;

        followedShow.data = show;
        await followedShow.save();

        res.json(show);
    }
});

async function getFormattedShows(url, userId) {
    const {data: {results}} = await axios.get(url);
    const followed = await Promise.all(results.map(show => Show.exists({userId, showId: show.id})));
    return results.map((show, i) => formatBasicShow(show, followed[i]));
}

module.exports = router;