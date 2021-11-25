import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';

const cache = {};

function SearchPage() {
    const [shows, setShows] = useState([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    let cancelToken;

    async function search(query) {
        setLoading(true);

        if (cancelToken) cancelToken.cancel();

        cancelToken = axios.CancelToken.source();
        let data;

        try {
            if (cache[query]) {
                data = cache[query];
            } else {
                data = (await axios.post('/search', {query: query}, {cancelToken: cancelToken.token})).data;
                cache[query] = data;
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                // Handle if request was cancelled
                console.log('Search request cancelled', error.message);
            } else {
                // Handle usual errors
                console.log('Something went wrong: ', error.message);
            }
        }

        setShows(data);
        setLoading(false);
    }

    function onInputChange(e) {
        search(e.target.value);
        setValue(e.target.value);
    }

    function renderShows() {
        if (!value) return <></>;
        if (loading) return <h2>Loading..</h2>;
        if (shows.length) return <ul>{shows.map(show => <li key={show.id}>{show.name} {show.id}</li>)}</ul>;
        return <h2>No results</h2>;
    }

    return (
        <>
            <h1>SearchPage</h1>

            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="search" value={value} onChange={onInputChange}/>
            </form>

            {renderShows()}
        </>
    );
}

export default SearchPage;
;