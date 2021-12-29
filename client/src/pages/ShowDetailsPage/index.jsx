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
    const [seasonIndex, setSeasonIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        setLoading(true);
        const s = await getShow();
        setShow(s);

        setLoading(false);
    }

    async function getShow() {
        const {data} = await axios.get(`/shows/${id}`);
        return data;
    }

    async function setEpisodeWatched(id, sNum, eNum, watched) {
        const {data} = await axios.patch(`/myshows/${id}/seasons/${sNum}/episodes/${eNum}`, {watched: watched});
        setShow(data);
    }

    async function setSeasonWatched(id, sNum) {
        const {data} = await axios.patch(`/myshows/${id}/seasons/${sNum}`, {watched: !currentSeason().watched});
        setShow(data);
    }

    async function setShowFollowing() {
        if (show.following) {
            const {data} = await axios.delete(`/myshows/${show.id}`);
            setShow(data);
        } else {
            const {data} = await axios.post('/myshows', {id: show.id});
            setShow(data);
        }
    }

    async function setShowWatched() {
        const {data} = await axios.patch(`/myshows/${id}`, {watched: !show.watched});
        setShow(data);
    }

    function currentSeason() {
        return show.seasons[seasonIndex];
    }

    function renderSeason() {
        if (show.seasons.length <= 0) return <></>;

        const options = show.seasons.map(({name, seasonNum}, i) => ({key: seasonNum, value: i, text: name}));

        return (
            <div className="show-details__season-header">
                <Header as="h2" content={currentSeason().name} className="show-details__season-title"/>
                <Dropdown
                    onChange={(e, {value: i}) => setSeasonIndex(i)}
                    selection
                    placeholder="Choose a season..."
                    options={options}
                    defaultValue={options[0].value}
                />
                {show.following && <LoadingButton active={currentSeason().watched} icon labelPosition="right"
                                                  clickHandler={async () => {
                                                      await setSeasonWatched(show.id, currentSeason().seasonNum);
                                                  }}>
                    <Icon name="checkmark"/>
                    Season
                </LoadingButton>}
            </div>
        );
    }

    function renderEpisodes() {
        if (!currentSeason().episodes.length) return <></>;

        // if (epLoading) return <></>;

        return (
            <Item.Group divided stackable>
                {currentSeason().episodes.map(ep => (
                    <Episode key={ep.id}
                             episode={{...ep, seasonNum: currentSeason().seasonNum, showName: show.name}}
                             withBtn={show.following && ep.date <= Date.now()}
                             clickHandler={async () => {
                                 await setEpisodeWatched(show.id, currentSeason().seasonNum, ep.episodeNum, !ep.watched);
                             }}/>
                ))}
            </Item.Group>
        );
    }

    function renderShow() {
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
                        {renderSeason()}
                        <Divider fitted/>
                        {renderEpisodes()}
                    </GridColumn>
                </Grid>
            </>
        );
    }

    return (
        <>
            {loading ? <Loader active inline="centered" className="show-details__loader"/> : renderShow()}
        </>
    );
}

export default ShowDetailsPage;