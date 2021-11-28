import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Divider, Header, Card, Segment, Menu, Input, Loader, Icon} from 'semantic-ui-react';
import Show from '../../components/Show';

let cancelToken;

function SearchPage() {
    const [shows, setShows] = useState([]);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultType, setResultType] = useState('');

    useEffect(() => {
        onResultChange('trending');
    }, []);

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

    function isLoading() {
        return loading || !shows;
    }

    async function onResultChange(type) {
        setResultType(type);
        if (type === 'trending' || type === 'top') {
            const {data} = await axios.get(`/shows/${type}`);
            setValue('');
            setShows(data);
        }
    }

    function renderLoader() {
        return (
            <div className="discover__results discover__results--empty">
                {isLoading() && <Loader active inline="centered" className="discover__loader"/>}
            </div>
        );
    }

    function renderNoResults() {
        return (
            <div className="discover__results discover__results--empty">
                <Header as="h3" color="grey" icon className="discover__no-results">
                    <Icon name="search"/>
                    No Results
                    <Header.Subheader>
                        There are no results for this search. Please try another keyword.
                    </Header.Subheader>
                </Header>
            </div>
        );
    }

    function renderShows() {
        if ((resultType === 'search' && !value) || isLoading()) return renderLoader();
        if (shows.length) return (
            <div className="discover__results">
                <Divider horizontal className="discover__results-title">Results</Divider>
                <Card.Group itemsPerRow={5} stackable={true} doubling={true}>
                    {shows.map(show => <Show key={show.id} show={show}/>)}
                </Card.Group>
            </div>
        );
        return renderNoResults();
    }

    return (
        <div className="discover" id="discover">
            <Segment as="section" className="discover__header">
                <Header as="h1" className="discover__title">Discover</Header>
                <Menu secondary fluid stackable className="discover__menu">
                    <Menu.Item className="discover__search-item">
                        <Input icon="search" placeholder="Search..." value={value} onChange={onInputChange}
                               onFocus={() => {
                                   onResultChange('search');
                               }}/>
                    </Menu.Item>
                    <Menu.Item
                        name="trending"
                        active={resultType === 'trending'}
                        onClick={(e, {name}) => {
                            onResultChange(name);
                        }}
                        color="blue"
                    />
                    <Menu.Item
                        name="top"
                        active={resultType === 'top'}
                        content="Top Rated"
                        onClick={(e, {name}) => {
                            onResultChange(name);
                        }}
                        color="blue"
                    />
                </Menu>
            </Segment>
            {renderShows()}
        </div>
    );
}

export default SearchPage;