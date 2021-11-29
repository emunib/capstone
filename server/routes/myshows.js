const axios = require('axios');
const {readShows, writeShows} = require('../utilities');
const querystring = require('querystring');
const {API_KEY} = require('../config');
const router = require('express').Router();

router.get('/', async (req, res) => {
    res.json(await readShows());
});

router.post('/:id', async (req, res) => {
    const id = req.params.id;
    const [shows, show] = await Promise.all([readShows(), getShowDetails(id)]);

    if (!shows.some(show => show.id == id)) {
        shows.push(show);
        await writeShows(shows);
    }

    res.json(show);
});

router.delete('/:id', async (req, res) => {
    let shows = await readShows();

    let show;
    shows = shows.filter(s => {
        if (s.id == req.params.id) {
            show = s;
            return false;
        }
        return true;
    });
    await writeShows(shows);

    res.json(show);
});

async function getShowDetails(id) {
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
    return seasonDetails.episodes.map(({id, episode_number, name, overview, air_date, still_path}) => ({
        id,
        name,
        overview,
        date: air_date,
        episodeNum: episode_number,
        img: `https://image.tmdb.org/t/p/original${still_path}`
    }));
}

//
// router.get('/:id', async (req, res) => {
//     const showDetails = await getShowDetails(req.params.id);
//
//     if (showDetails) {
//         res.json(showDetails);
//     } else {
//         res.status(404).json({message: 'invalid show id'});
//     }
// });

// router.patch('/:id', async (req, res) => {
//     const shows = await readShows();
//     const show = shows.find(show => show.id == req.params.id);
//
//     if (show) {
//         Object.keys(req.body).forEach(key => {
//             if (Object.keys(show).includes(key)) show[key] = req.body[key];
//         });
//         res.json(show);
//     } else {
//         res.status(404).json({message: 'invalid show id'});
//     }
// });

// router.get('/:id/latest', async (req, res) => {
//     const show =
// })


module.exports = router;