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
            season.episodes.forEach(episode => {
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
        season.episodes.forEach(episode => {
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
        season.watched = season.episodes.every(ep => ep.watched);
        show.data.watched = show.data.seasons.every(s => s.watched);

        await show.save();
        res.json(show.data);
    }
});
//
// // get up next episode for each show
// router.get('/episodes/next', async (req, res) => {
//     const followingShows = await readShows(req.user.id);
//     const nextEpisodes = [];
//
//     for (let show of followingShows.values()) {
//         const episodes = [];
//
//         for (const season of show.seasons.values()) {
//             episodes.push(...Array.from(season.episodes.values(), ep => ({
//                 ...ep,
//                 showName: show.name,
//                 seasonNum: season.seasonNum,
//                 showId: show.id
//             })));
//         }
//
//         const episode = episodes.filter(ep => ep.date <= Date.now()).find(ep => !ep.watched);
//         if (episode) nextEpisodes.push(episode);
//     }
//
//     res.json(nextEpisodes);
// });

// function setEpisodeWatched(show, seasonNum, episodeNum, watched) {
//     const episodes = show.seasons.get(seasonNum).episodes;
//     episodes.get(episodeNum).watched = watched;
//     show.seasons.get(seasonNum).watched = Array.from(episodes.keys()).every(num => episodes.get(num).watched || episodes.get(num).date > Date.now());
//     show.watched = Array.from(show.seasons.keys()).every(num => show.seasons.get(num).watched);
//
// }
//
// function setSeasonWatched(show, seasonNum, watched) {
//     for (let num of show.seasons.get(seasonNum).episodes.keys()) {
//         setEpisodeWatched(show, seasonNum, num, watched);
//     }
//     show.watched = Array.from(show.seasons.keys()).every(num => show.seasons.get(num).watched);
// }
//
// function setShowWatched(show, watched) {
//     for (let num of show.seasons.keys()) {
//         setSeasonWatched(show, num, watched);
//     }
// }

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