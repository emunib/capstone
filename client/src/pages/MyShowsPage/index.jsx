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
        <div className="my-shows">
            <Card.Group itemsPerRow={5} stackable={true} doubling={true}>
                {shows.map(show => <Show key={show.id} show={show} onClick={async e => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (show.following) {
                        await axios.delete(`/myshows/${show.id}`);
                    } else {
                        await axios.post('/myshows', {id: show.id});
                    }
                    loadShows();
                }}/>)}
            </Card.Group>
        </div>
    );
}

export default MyShowsPage;