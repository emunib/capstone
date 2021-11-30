import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Header, Icon, Item, Segment} from 'semantic-ui-react';
import Episode from '../../components/Episode';

function MyShowsPage() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(false);

    async function getShows() {
        setLoading(true);
        const {data: shows} = await axios.get('/myshows');
        const eps = await Promise.all(shows.map(({id}) => axios.get(`/myshows/${id}/latest`)));
        setLoading(false);
        setEpisodes(eps.map((ep, i) => ({...ep.data, showName: shows[i].name})));
    }

    useEffect(() => {
        getShows();
    }, []);

    function renderShows() {
        console.log(episodes);
        if (episodes.length && episodes.every(ep => ep.id)) {
            return episodes.filter(ep => ep.id).map(ep =>
                <Segment>
                    <Item.Group divided unstackable>
                        <Episode key={ep.id} episode={ep} onClick={() => {
                            getLatest(ep.id);
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

    async function getLatest(id) {
        await axios.patch(`/myshows/episodes/${id}`, {watched: true});
        getShows();
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