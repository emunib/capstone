import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import Show from '../../components/Show';

let cancelToken;

function SearchPage() {
    const [shows, setShows] = useState([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);

    async function search(query) {
        setLoading(true);

        if (cancelToken) cancelToken.cancel();

        cancelToken = axios.CancelToken.source();
        let data;

        try {
            data = (await axios.post('/search', {query: query}, {cancelToken: cancelToken.token})).data;
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Search request cancelled', error.message);
            } else {
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
        if (loading || !shows) return <h2>Loading..</h2>;
        if (shows.length) return <div>{shows.map(show => <Show show={show}/>)}</div>;
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