import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import Show from '../../components/Show';

function MyShowsPage() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/myshows').then(({data}) => {
            setShows(data);
            setLoading(false);
        });
    }, []);

    function renderShows() {
        if (loading || !shows) return <h2>Loading..</h2>;
        if (shows.length) return <div>{shows.map(show => <Show show={show}/>)}</div>;
        return <h2>No results</h2>;
    }

    return (
        <>
            <h1>MyShowsPage</h1>

            {renderShows()}
        </>
    );
}

export default MyShowsPage;