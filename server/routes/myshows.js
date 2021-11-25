const axios = require('axios');
const {readData, writeData} = require('../utilities/utilities');
const querystring = require('querystring');
const {API_KEY} = require('../config');
const router = require('express').Router();

router.get('/', async (req, res) => res.json(await readData()));

router.post('/:id', async (req, res) => {
    const shows = await readData();
    const id = req.params.id;

    if (!shows.includes(id)) {
        shows.push(id);
        await writeData(shows);
    }

    res.json(shows); // decide on appropriate response...
});

async function getShowDetails(id) {
    const shows = await readData();

    if (!shows.includes(id)) return null;

    let {data: showDetails} = await axios.get(`https://api.themoviedb.org/3/tv/${id}?${querystring.stringify({api_key: API_KEY})}`);
    showDetails = (({name, overview, seasons, poster_path, number_of_seasons}) => ({
        name,
        id,
        overview,
        numSeasons: number_of_seasons,
        img: `https://image.tmdb.org/t/p/original${poster_path}`,
        seasons: seasons.map(({id, name, overview, poster_path, season_number}) => ({
            id,
            name,
            overview,
            seasonNum: season_number,
            img: `https://image.tmdb.org/t/p/original${poster_path}`
        }))
    }))(showDetails);

    const episodes = await Promise.all(showDetails.seasons.map(({seasonNum}) => getSeasonEpisodes(id, seasonNum)));
    showDetails.seasons.forEach((season, i) => {
        season.episodes = episodes[i];
    });

    return showDetails;
}

async function getSeasonEpisodes(id, num) {
    const {data: seasonDetails} = await axios.get(`https://api.themoviedb.org/3/tv/${id}/season/${num}?${querystring.stringify({api_key: API_KEY})}`);
    return seasonDetails.episodes.map(({id, episode_number, name, overview, still_path}) => ({
        id,
        name,
        overview,
        episodeNum: episode_number,
        img: `https://image.tmdb.org/t/p/original${still_path}`
    }));
}

router.get('/:id', async (req, res) => {
    const showDetails = await getShowDetails(req.params.id);

    if (showDetails) {
        res.json(showDetails);
    } else {
        res.status(404).json({message: 'invalid show id'});
    }
});

module.exports = router;