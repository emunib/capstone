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
        seasons: seasons.map(({id: snId, name, overview, poster_path, season_number}) => ({
            id: snId,
            showId: id,
            name,
            overview,
            watched: false,
            seasonNum: season_number,
            img: `https://image.tmdb.org/t/p/original${poster_path}` // TODO: PLACEHOLDER IMG
        }))
    }))(showDetails);

    const episodes = await Promise.all(showDetails.seasons.map(season => getSeasonEpisodes(id, season.id, season.seasonNum)));
    showDetails.seasons.forEach((season, i) => {
        season.episodes = episodes[i];
    });

    return showDetails;
}

async function getSeasonEpisodes(shId, snId, num) {
    const {data: seasonDetails} = await axios.get(`https://api.themoviedb.org/3/tv/${shId}/season/${num}?${querystring.stringify({api_key: API_KEY})}`);
    return seasonDetails.episodes.map(({id: epId, episode_number, name, overview, air_date, still_path}) => ({
        id: epId,
        showId: shId,
        seasonId: snId,
        name,
        overview,
        watched: false,
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

router.patch('/episodes/:id', async (req, res) => {
    const shows = await readShows();
    let episode, season;
    shows.forEach(show => show.seasons.forEach(sn => sn.episodes.forEach(ep => {
        if (ep.id == req.params.id) {
            Object.keys(req.body).forEach(key => {
                if (Object.keys(ep).includes(key)) ep[key] = req.body[key];
            });
            episode = ep;
            season = sn;
        }
    })));

    if (episode) {
        season.watched = season.episodes.every(ep => ep.watched);
        await writeShows(shows);

        res.json(episode);
    } else {
        res.status(404).json({message: 'invalid episode id'});
    }
});

router.get('/:id/latest', async (req, res) => {
    const shows = await readShows();
    const show = shows.find(show => show.id == req.params.id);

    if (show) {
        const unwatched = show.seasons.filter(season => !season.watched);

        if (unwatched.length > 0) {
            // get all episodes in single array
            const latest = unwatched.flatMap(season => season.episodes)
                // get all unwatched episodes
                .filter(episode => !episode.watched)
                // get oldest episode
                .reduce((prev, curr) =>
                    new Date(prev.date.replace(/-/g, '\/')) <= new Date(curr.date.replace(/-/g, '\/')) ? prev : curr);

            res.json(latest);
        } else {
            res.json({}); // TODO: CODE 203?
        }
    } else {
        res.status(404).json({message: 'invalid show id'});
    }
});


module.exports = router;