import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Card} from 'semantic-ui-react';
import Show from '../../components/Show';

function MyShowsPage() {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        loadShows();
    }, []);

    async function loadShows() {
        const {data} = await axios.get('/myshows');
        setShows(data);
    }

    return (
        <Card.Group itemsPerRow={5} stackable={true} doubling={true}>
            {shows.map(show => <Show key={show.id} show={show} onClick={async () => {
                if (show.following) {
                    await axios.delete(`/myshows/${show.id}`);
                } else {
                    await axios.post('/myshows', {id: show.id});
                }
                loadShows();
            }}/>)}
        </Card.Group>

        // <Accordion fluid styled>
        //     <Accordion.Title
        //         active={activeIndex === 0}
        //         index={0}
        //         onClick={handleClick}
        //     >
        //         <Icon name="dropdown"/>
        //         What is a dog?
        //         <Button icon="plus" onClick={event => {
        //             event.stopPropagation();
        //         }}/>
        //     </Accordion.Title>
        //     <Accordion.Content active={activeIndex === 0}>
        //         <p>
        //             A dog is a type of domesticated animal. Known for its loyalty and
        //             faithfulness, it can be found as a welcome guest in many households
        //             across the world.
        //         </p>
        //     </Accordion.Content>
        // </Accordion>
    );
}

export default MyShowsPage;