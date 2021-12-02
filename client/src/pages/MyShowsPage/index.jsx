import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Header, Icon, Item, Segment} from 'semantic-ui-react';
import Episode from '../../components/Episode';

function MyShowsPage() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getNextEpisodes() {
        setLoading(true);
        const {data} = await axios.get(`/myshows/episodes/next`);
        setEpisodes(data);
        setLoading(false);
        console.log(episodes);
    }

    useEffect(() => {
        getNextEpisodes();
    }, []);

    function renderShows() {
        if (episodes.length) {
            console.log(episodes, episodes.length);
            return episodes.map(ep =>
                <Segment key={ep.id}>
                    <Item.Group divided unstackable>
                        <Episode episode={ep} onClick={() => {
                            setWatched(ep.showId, ep.seasonNum, ep.episodeNum);
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

            {/*{renderShows()}*/}
            {/*<Accordion fluid styled>*/}
            {/*    <Accordion.Title*/}
            {/*        active={activeIndex === 0}*/}
            {/*        index={0}*/}
            {/*        onClick={handleClick}*/}
            {/*    >*/}
            {/*        <Icon name="dropdown"/>*/}
            {/*        What is a dog?*/}
            {/*        <Button icon="plus" onClick={event => {*/}
            {/*            event.stopPropagation();*/}
            {/*        }}/>*/}
            {/*    </Accordion.Title>*/}
            {/*    <Accordion.Content active={activeIndex === 0}>*/}
            {/*        <p>*/}
            {/*            A dog is a type of domesticated animal. Known for its loyalty and*/}
            {/*            faithfulness, it can be found as a welcome guest in many households*/}
            {/*            across the world.*/}
            {/*        </p>*/}
            {/*    </Accordion.Content>*/}
            {/*</Accordion>*/}
            {renderShows()}
        </>
    );
}

export default MyShowsPage;