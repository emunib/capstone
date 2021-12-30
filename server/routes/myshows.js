const axios = require('axios');
const {readShows, writeShows, formatBasicShow, getShow, formatDetailedShow} = require('../utils');
const qs = require('querystring');
const {API_KEY} = process.env;
const router = require('express').Router();
const baseURL = 'https://api.themoviedb.org/3/tv/';
const query = {
    api_key: API_KEY
};
const Show = require('../database/models/show');

// get all followed shows
router.get('/', async (req, res) => {
    const userId = req.user.id;

    const shows = await Show.find({userId}, '-data.seasons').exec();
    res.json(Array.from(shows, ({data}) => data));
});

router.patch('/:id', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.params.id);
    const {watched} = req.body;

    if (typeof watched === 'boolean') {
        const show = await Show.findOne({userId, showId});
        show.data.watched = watched;
        show.data.seasons.forEach(season => {
            season.watched = watched;
            season.episodes.filter(ep => ep.date <= Date.now()).forEach(episode => {
                episode.watched = watched;
            });
        });
        await show.save();
        res.json(show.data);
    }
});

router.patch('/:id/seasons/:num', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.params.id);
    const seasonNum = parseInt(req.params.num);
    const {watched} = req.body;

    if (typeof watched === 'boolean') {
        const show = await Show.findOne({userId, showId});
        const season = show.data.seasons.find(s => s.seasonNum === seasonNum);

        season.watched = watched;
        season.episodes.filter(ep => ep.date <= Date.now()).forEach(episode => {
            episode.watched = watched;
        });

        show.data.watched = show.data.seasons.every(s => s.watched);
        await show.save();
        res.json(show.data);
    }
});

router.patch('/:id/seasons/:sNum/episodes/:eNum', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.params.id);
    const seasonNum = parseInt(req.params.sNum);
    const episodeNum = parseInt(req.params.eNum);
    const {watched} = req.body;

    if (typeof watched === 'boolean') {
        const show = await Show.findOne({userId, showId});
        const season = show.data.seasons.find(s => s.seasonNum === seasonNum);
        const episode = season.episodes.find(ep => ep.episodeNum === episodeNum);

        episode.watched = watched;
        season.watched = season.episodes.filter(ep => ep.date <= Date.now()).every(ep => ep.watched);
        show.data.watched = show.data.seasons.every(s => s.watched);

        await show.save();
        res.json(show.data);
    }
});

// get up next episode for each show
router.get('/episodes/next', async (req, res) => {
    const userId = req.user.id;

    const shows = await Show.find({userId}).lean().exec();
    const showEpisodes = [];

    shows.forEach(({data: show}) => {
        const seasonEps = show.seasons.map(sn => sn.episodes
            .map(ep => ({
                ...ep,
                showId: show.id,
                showName: show.name,
                seasonNum: sn.seasonNum
            })).filter(ep => !ep.watched && ep.date <= Date.now()));

        seasonEps.forEach(eps => {
            if (eps.length) showEpisodes.push(eps[0]);
        });
    });

    res.json(showEpisodes);
});

router.post('/', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.body.id);

    const show = await Show.findOne({userId, showId}).exec();

    if (show) {
        res.json(show.data);
    } else {
        const data = await formatDetailedShow(await getShow(showId), true);
        await (new Show({userId, showId, data}).save());
        res.json(data);
    }
});

router.delete('/:id', async (req, res) => {
    const userId = req.user.id;
    const showId = parseInt(req.params.id);

    const show = await Show.findOneAndDelete({userId, showId}).exec();

    if (show) {
        show.data.following = false;
        res.json(show.data);
    }
});

module.exports = router;