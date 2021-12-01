const axios = require('axios');
const {readShows, writeShows} = require('../utilities');
const qs = require('querystring');
const {API_KEY} = require('../config');
const router = require('express').Router();
const baseURL = 'https://api.themoviedb.org/3/tv/';
const queryParams = {
    api_key: API_KEY
};
// TODO: APPROPRIATE RESPONSES FOR ERROR, PATCH,POST,DELETE
// get all followed shows
router.get('/', async (req, res) => {
    const followingShows = await readShows();
    res.json(Array.from(followingShows.values()));
});

// get a followed show
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const followingShows = await readShows();
    if (followingShows.has(id)) {
        res.json(followingShows.get(id));
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// add show to followed
router.post('/', async (req, res) => {
    const id = parseInt(req.body.id);
    const followingShows = await readShows();

    if (!followingShows.has(id)) {
        const show = await createShow(id);
        followingShows.set(id, show);
        await writeShows(followingShows);
        res.json(show);
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// remove show from followed
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const followingShows = await readShows();

    if (followingShows.has(id)) {
        const show = followingShows.get(id);
        followingShows.delete(id);
        await writeShows(followingShows);
        res.json(show);
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// update followed show, specifically for setting watched property
router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const followingShows = await readShows();

    if (followingShows.has(id)) {
        const data = req.body;

        if (data.watched === true || data.watched === false) {
            const show = followingShows.get(id);
            show.watched = data.watched;
            await writeShows(followingShows);
            res.json(show);
        } else {
            res.status(404).json({message: 'No show with that id was found'});
        }
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

async function createShow(id) {
    const {data} = await axios.get(`${baseURL}${id}?${qs.encode(queryParams)}`);
    const show = {
        id: data.id,
        name: data.name,
        overview: data.overview,
        watched: false,
        numSeasons: data.number_of_seasons,
        numEpisodes: data.number_of_episodes,
        img: data.poster_path ? `https://image.tmdb.org/t/p/original${data.poster_path}` : '/images/placeholder.png'
    };

    let seasonData = data.seasons.map(season => ([season.season_number, {
        id: season.id,
        name: season.name,
        overview: season.overview,
        watched: false,
        seasonNum: season.season_number,
        numEpisodes: season.episode_count,
        img: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : show.img
    }]));

    // if the show has a season 0 for specials move it to the end
    if (seasonData.length && seasonData[0][0] === 0) {
        const [first, ...rest] = seasonData;
        seasonData = [...rest, first];
    }

    show.seasons = new Map(seasonData);

    for (let season of show.seasons.values()) { // TODO: USE PROMISE.ALL
        season.episodes = await getEpisodes(id, season.seasonNum, season.img);
    }

    return show;
}

async function getEpisodes(id, num, img) {
    const {data} = await axios.get(`${baseURL}${id}/season/${num}?${qs.encode(queryParams)}`);

    return new Map(data.episodes.map(ep => [ep.episode_number, {
        episodeNum: ep.episode_number,
        date: new Date(ep.air_date.replace(/-/g, '\/')),
        name: ep.name,
        overview: ep.overview,
        watched: false,
        img: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : img
    }]));
}

router.get('/episodes/next', async (req, res) => {
    const followingShows = await readShows();
    const nextEpisodes = [];

    for (let show of followingShows.values()) {
        if (show.watched) continue;

        const nextSeasonNum = Array.from(show.seasons.keys()).find(num => !show.seasons.get(num).watched);
        if (nextSeasonNum === undefined) continue;

        const nextSeason = show.seasons.get(nextSeasonNum);
        const nextEpisodeNum = Array.from(nextSeason.episodes.keys()).find(num => !nextSeason.episodes.get(num).watched);

        const nextEpisode = {
            ...nextSeason.episodes.get(nextEpisodeNum),
            showName: show.name,
            seasonNum: nextSeasonNum,
            showId: show.id
        };
        nextEpisodes.push(nextEpisode);
    }
    res.json(nextEpisodes);
});

function setEpisodeWatched(show, seasonNum, episodeNum, watched) {

}

function setSeasonWatched(show, seasonNum, watched) {

}

function setShowWatched(show, watched) {

}

// router.get('/:id/latest', async (req, res) => {
//     const shows = await readShows();
//     const show = shows.find(show => show.id == req.params.id);
//
//     if (show) {
//         const unwatched = show.seasons.filter(season => !season.watched);
//
//         if (unwatched.length > 0) {
//             // get all episodes in single array
//             const unwatchedAired = unwatched.flatMap(season => season.episodes)
//                 // get all unwatched episodes
//                 .filter(episode => !episode.watched)
//                 // get all aired episodes
//                 .filter(episode => new Date(episode.date.replace(/-/g, '\/')) < Date.now());
//
//             if (unwatchedAired.length) {
//                 // get oldest episode
//                 const latest = unwatchedAired.reduce((prev, curr) =>
//                     new Date(prev.date.replace(/-/g, '\/')) <= new Date(curr.date.replace(/-/g, '\/')) ? prev : curr);
//
//                 res.json(latest);
//             } else {
//                 res.json({}); // TODO: CODE 203?
//             }
//         } else {
//             res.json({}); // TODO: CODE 203?
//         }
//     } else {
//         res.status(404).json({message: 'invalid show id'});
//     }
// });


module.exports = router;