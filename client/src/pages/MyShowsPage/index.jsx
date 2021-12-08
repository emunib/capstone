import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Card, Divider, Header, Icon, Loader} from 'semantic-ui-react';
import Show from '../../components/Show';

function MyShowsPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        init();
    }, []);

    async function loadShows() {
        const {data} = await axios.get('/myshows');
        setShows(data);
    }

    async function init() {
        setLoading(true);
        await loadShows();
        setLoading(false);
    }

    function renderEmpty() {
        return (
            <Header as="h3" color="grey" icon>
                <Icon name="frown outline"/>
                No Shows
                <Header.Subheader>
                    Follow some shows to see them here
                </Header.Subheader>
            </Header>
        );
    }

    return (
        <>
            {loading ? <Loader active inline="centered" className="my-shows__loader"/> :
                <div className="my-shows">
                    <Divider hidden fitted/>
                    <Header as="h1" textAlign="center">My Shows</Header>
                    {shows.length ?
                        <Card.Group itemsPerRow={5} stackable={true} doubling={true} className="my-shows__content">
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
                        </Card.Group> : renderEmpty()}
                </div>}
        </>
    );
}

export default MyShowsPage;