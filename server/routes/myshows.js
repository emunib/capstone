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

// update episode, specifically for setting watched property
router.patch('/:id/seasons/:sNum/episodes/:eNum', async (req, res) => {
    const id = parseInt(req.params.id);
    const seasonNum = parseInt(req.params.sNum);
    const episodeNum = parseInt(req.params.eNum);
    const followingShows = await readShows();
    const data = req.body;

    if (followingShows.has(id) && (data.watched === true || data.watched === false)) {
        const seasons = followingShows.get(id).seasons;
        if (seasons.has(seasonNum)) {
            const episodes = seasons.get(seasonNum).episodes;
            if (episodes.has(episodeNum)) {
                setEpisodeWatched(followingShows.get(id), seasonNum, episodeNum, data.watched);
                await writeShows(followingShows);
                res.json(episodes.get(episodeNum));
            } else {
                res.status(404).json({message: 'No episode with that number was found'});
            }
        } else {
            res.status(404).json({message: 'No season with that number was found'});
        }
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// update season, specifically for setting watched property
router.patch('/:id/seasons/:sNum', async (req, res) => {
    const id = parseInt(req.params.id);
    const seasonNum = parseInt(req.params.sNum);
    const followingShows = await readShows();
    const data = req.body;

    if (followingShows.has(id) && (data.watched === true || data.watched === false)) {
        const seasons = followingShows.get(id).seasons;
        if (seasons.has(seasonNum)) {
            setSeasonWatched(followingShows.get(id), seasonNum, data.watched);
            await writeShows(followingShows);
            res.json(seasons.get(seasonNum));
        } else {
            res.status(404).json({message: 'No season with that number was found'});
        }
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// update followed show, specifically for setting watched property
router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const followingShows = await readShows();
    const data = req.body;

    if (followingShows.has(id) && (data.watched === true || data.watched === false)) {
        const show = followingShows.get(id);
        setShowWatched(show, data.watched);
        await writeShows(followingShows);
        res.json(show);
    } else {
        res.status(404).json({message: 'No show with that id was found'});
    }
});

// get up next episode for each show
router.get('/episodes/next', async (req, res) => {
    const followingShows = await readShows();
    const nextEpisodes = [];

    for (let show of followingShows.values()) {
        const episodes = [];

        for (const season of show.seasons.values()) {
            episodes.push(...Array.from(season.episodes.values(), ep => ({
                ...ep,
                showName: show.name,
                seasonNum: season.seasonNum,
                showId: show.id
            })));
        }

        const episode = episodes.filter(ep => ep.date <= Date.now()).find(ep => !ep.watched);
        if (episode) nextEpisodes.push(episode);
    }

    res.json(nextEpisodes);
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
        id: ep.id,
        episodeNum: ep.episode_number,
        date: Date.parse(ep.air_date.replace(/-/g, '\/')),
        name: ep.name,
        overview: ep.overview,
        watched: false,
        img: ep.still_path ? `https://image.tmdb.org/t/p/original${ep.still_path}` : img
    }]));
}

function setEpisodeWatched(show, seasonNum, episodeNum, watched) {
    const episodes = show.seasons.get(seasonNum).episodes;
    episodes.get(episodeNum).watched = watched;
    show.seasons.get(seasonNum).watched = Array.from(episodes.keys()).every(num => episodes.get(num).watched);
    show.watched = Array.from(show.seasons.keys()).every(num => show.seasons.get(num).watched);

}

function setSeasonWatched(show, seasonNum, watched) {
    for (let num of show.seasons.get(seasonNum).episodes.keys()) {
        setEpisodeWatched(show, seasonNum, num, watched);
    }
    show.watched = Array.from(show.seasons.keys()).every(num => show.seasons.get(num).watched);
}

function setShowWatched(show, watched) {
    for (let num of show.seasons.keys()) {
        setSeasonWatched(show, num, watched);
    }
}

module.exports = router;