import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {useParams} from 'react-router-dom';
import {Divider, Dropdown, Grid, GridColumn, Header, Icon, Image, Item, Loader} from 'semantic-ui-react';
import Episode from '../../components/Episode';
import LoadingButton from '../../components/LoadingButton';

function ShowDetailsPage() {
    const {id} = useParams();
    const [show, setShow] = useState();
    const [season, setSeason] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        init();
    }, []);

    async function loadShow() {
        const {data} = await axios.get(`/shows/${id}`);
        setShow(data);
        if (!season && data.seasons.length) {
            setSeason(data.seasons[0]);
        }
    }

    async function init() {
        setLoading(true);
        await loadShow();
        setLoading(false);
    }

    async function changeSeason(num) {
        const {data} = await axios.get(`/myshows/${id}/seasons/${num}`);
        setSeason(data);
    }

    async function setEpisodeWatched(id, sNum, eNum, watched) {
        await axios.patch(`/myshows/${id}/seasons/${sNum}/episodes/${eNum}`, {watched: watched});
        await loadShow();
        await changeSeason(season.seasonNum);
    }

    async function setSeasonWatched(id, sNum) {
        await axios.patch(`/myshows/${id}/seasons/${sNum}`, {watched: !season.watched});
        await loadShow();
        await changeSeason(season.seasonNum);
    }

    async function setShowFollowing() {
        if (show.following) {
            await axios.delete(`/myshows/${show.id}`);
        } else {
            await axios.post('/myshows', {id: show.id});
        }
        await loadShow();
    }

    async function setShowWatched() {
        await axios.patch(`/myshows/${id}`, {watched: !show.watched});
        await loadShow();
        await changeSeason(season.seasonNum);
    }

    function renderShow() {
        if (show && season) {
            const options = show.seasons.map(({name, seasonNum}) => ({key: seasonNum, value: seasonNum, text: name}));
            return (
                <>
                    <Divider hidden/>
                    <Grid className="show-details" container columns="equal" stackable>
                        <GridColumn width={5}>
                            <Image rounded src={show.img}/>
                        </GridColumn>
                        <GridColumn className="show-details__content">
                            <div className="show-details__show-btns">
                                <LoadingButton active={show.following} icon="plus" clickHandler={setShowFollowing}/>
                                {show.following && <LoadingButton active={show.watched} icon labelPosition="right"
                                                                  clickHandler={async () => {
                                                                      await setShowWatched();
                                                                  }}>
                                    <Icon name="checkmark"/>
                                    Show
                                </LoadingButton>}
                            </div>
                            <Header as="h1" content={show.name} textAlign="center"/>
                            <p>{show.overview}</p>
                            <Divider hidden/>
                            <div className="show-details__season-header">
                                <Header as="h2" content={season.name} className="show-details__season-title"/>
                                <Dropdown
                                    onChange={(e, {value}) => {
                                        changeSeason(value);
                                    }}
                                    selection
                                    placeholder="Choose a season..."
                                    options={options}
                                    {...(options.length ? {defaultValue: options[0].value} : {})}
                                />
                                {show.following && <LoadingButton active={season.watched} icon labelPosition="right"
                                                                  clickHandler={async () => {
                                                                      await setSeasonWatched(show.id, season.seasonNum);
                                                                  }}>
                                    <Icon name="checkmark"/>
                                    Season
                                </LoadingButton>}
                            </div>
                            <Divider fitted/>
                            <Item.Group divided stackable>
                                {season.episodes.map(ep => (
                                    <Episode key={ep.id}
                                             episode={{...ep, seasonNum: season.seasonNum, showName: show.name}}
                                             withBtn={show.following && ep.date <= Date.now()}
                                             clickHandler={async () => {
                                                 await setEpisodeWatched(show.id, season.seasonNum, ep.episodeNum, !ep.watched);
                                             }}/>
                                ))}
                            </Item.Group>
                        </GridColumn>
                    </Grid>
                </>
            );
        }
    }

    return (
        <>
            {loading ? <Loader active inline="centered" className="show-details__loader"/> : renderShow()}
        </>
    );
}

export default ShowDetailsPage;