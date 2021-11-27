import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Divider, Form, Header, Card, Segment} from 'semantic-ui-react';
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
        if (!value || isLoading()) return;
        if (shows.length) return <Card.Group itemsPerRow={5} stackable={true} doubling={true}>{shows.map(show => <Show
            show={show}/>)}</Card.Group>;
        return <h2>No results</h2>;
    }

    function isLoading() {
        return loading || !shows;
    }

    return (
        <Segment as="section" className="search">
            <Header as="h1" className="search__title">Search</Header>
            <Form onSubmit={e => e.preventDefault()}>
                <Divider className="search__divider"/>
                <Form.Input
                    placeholder="Search..."
                    name="search"
                    onChange={onInputChange}
                />
            </Form>
            <Divider horizontal className="search__results-title search__divider">Results</Divider>
            <Segment loading={isLoading()} basic className="search__results">
                {renderShows()}
            </Segment>
        </Segment>
    );
}

export default SearchPage;