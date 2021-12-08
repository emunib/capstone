import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Divider, Header, Icon, Item, Segment} from 'semantic-ui-react';
import Episode from '../../components/Episode';

function UpNextPage() {
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
                    <Header as="h2" content={ep.showName} textAlign="center"/>
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
        }
    }

    async function setWatched(id, sNum, eNum) {
        await axios.patch(`/myshows/${id}/seasons/${sNum}/episodes/${eNum}`, {watched: true});
        getNextEpisodes();
    }


    return (
        <>
            <Divider hidden fitted/>
            <Header as="h1" textAlign="center">Up Next</Header>
            {renderShows()}
        </>
    );
}

export default UpNextPage;