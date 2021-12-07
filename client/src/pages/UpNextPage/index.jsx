import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Header, Icon, Item, Segment} from 'semantic-ui-react';
import Episode from '../../components/Episode';

function MyShowsPage() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false); // TODO LOADING SPINNER

    async function getNextEpisodes() {
        setLoading(true);
        const {data} = await axios.get(`/myshows/episodes/next`);
        setEpisodes(data);
        setLoading(false);
    }

    useEffect(() => {
        getNextEpisodes();
    }, []);

    function renderShows() {
        if (episodes.length) {
            return episodes.map(ep =>
                <Segment key={ep.id}>
                    <Item.Group divided stackable>
                        <Episode withBtn={true} episode={ep} clickHandler={async () => {
                            await setWatched(ep.showId, ep.seasonNum, ep.episodeNum);
                        }}/>
                    </Item.Group>
                </Segment>
            );
        } else {
            return <Header as="h3" color="grey" icon>
                <Icon name="thumbs up"/>
                No episodes remaining.
                <Header.Subheader>
                    You're all caught up!
                </Header.Subheader>
            </Header>;
            // TODO: USE LABELS IN CORNER OF CARD INSTEAD OF BUTTONS
        }
    }

    async function setWatched(id, sNum, eNum) {
        await axios.patch(`/myshows/${id}/seasons/${sNum}/episodes/${eNum}`, {watched: true});
        getNextEpisodes();
    }


    return (
        <>
            <Header as="h1">Up Next</Header>
            {renderShows()}
        </>
    );
}

export default MyShowsPage;