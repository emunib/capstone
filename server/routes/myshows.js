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

    show.seasons = new Map(data.seasons.map(season => ([season.season_number, {
        id: season.id,
        name: season.name,
        overview: season.overview,
        watched: false,
        seasonNum: season.season_number,
        numEpisodes: season.episode_count,
        img: season.poster_path ? `https://image.tmdb.org/t/p/original${season.poster_path}` : show.img
    }])));

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
        img: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : img
    }]));
}

// router.delete('/:id', async (req, res) => {
//     let shows = await readShows();
//
//     let show;
//     shows = shows.filter(s => {
//         if (s.id == req.params.id) {
//             show = s;
//             return false;
//         }
//         return true;
//     });
//     await writeShows(shows);
//
//     res.json(show);
// });
//
// async function getShowDetails(id) {
//     let {data: showDetails} = await axios.get(`https://api.themoviedb.org/3/tv/${id}?${querystring.stringify({api_key: API_KEY})}`);
//     showDetails = (({name, overview, seasons, poster_path, number_of_seasons}) => ({
//         name,
//         id,
//         overview,
//         numSeasons: number_of_seasons,
//         img: `https://image.tmdb.org/t/p/original${poster_path}`,
//         seasons: seasons.map(({id: snId, name, overview, poster_path, season_number}) => ({
//             id: snId,
//             name,
//             overview,
//             watched: false,
//             seasonNum: season_number,
//             img: `https://image.tmdb.org/t/p/original${poster_path}` // TODO: PLACEHOLDER IMG
//         }))
//     }))(showDetails);
//
//     const episodes = await Promise.all(showDetails.seasons.map(season => getSeasonEpisodes(id, season.id, season.seasonNum)));
//     showDetails.seasons.forEach((season, i) => {
//         season.episodes = episodes[i];
//     });
//
//     return showDetails;
// }
//
// async function getSeasonEpisodes(shId, snId, num) { // TODO: CLEAN UP / REFRACTOR
//     const {data: seasonDetails} = await axios.get(`https://api.themoviedb.org/3/tv/${shId}/season/${num}?${querystring.stringify({api_key: API_KEY})}`);
//     return seasonDetails.episodes.map(({id: epId, episode_number, name, overview, air_date, still_path}) => ({
//         id: epId,
//         name,
//         overview,
//         seasonNum: num,
//         watched: false,
//         date: air_date,
//         episodeNum: episode_number,
//         img: `https://image.tmdb.org/t/p/original${still_path}`
//     }));
// }
//
// router.patch('/episodes/:id', async (req, res) => {
//     const shows = await readShows();
//     let episode, season;
//     shows.forEach(show => show.seasons.forEach(sn => sn.episodes.forEach(ep => { // TODO: SIMPLIFY TO JUST WATCHED PROPERTY?
//         if (ep.id == req.params.id) {
//             Object.keys(req.body).forEach(key => {
//                 if (Object.keys(ep).includes(key)) ep[key] = req.body[key];
//             });
//             episode = ep;
//             season = sn;
//         }
//     })));
//
//     if (episode) {
//         season.watched = season.episodes.every(ep => ep.watched);
//         await writeShows(shows);
//
//         res.json(episode);
//     } else {
//         res.status(404).json({message: 'invalid episode id'});
//     }
// });
//
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