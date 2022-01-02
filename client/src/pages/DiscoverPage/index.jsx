import {useWindowWidth} from '@react-hook/window-size';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Divider, Header, Card, Menu, Input, Loader, Icon, Button} from 'semantic-ui-react';
import Show from '../../components/Show';
import {postRequest, getRequest} from '../../utils/axiosClient';

let cancelToken;

function SearchPage() {
    const [shows, setShows] = useState([]);
    const [page, setPage] = useState(1);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [resultType, setResultType] = useState('');
    const windowWidth = useWindowWidth();

    useEffect(() => {
        onResultChange('trending');
    }, []);

    async function search(query) {
        setLoading(true);

        if (cancelToken) cancelToken.cancel();

        cancelToken = axios.CancelToken.source();
        let data;

        try {
            data = (await postRequest('/shows/search', {query: query}, {cancelToken: cancelToken.token})).data;
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
        setPage(1);
        setResultType(type);
        if (type === 'trending' || type === 'top') {
            setLoading(true);
            const {data} = await getShows(type, 1);
            setValue('');
            setShows(data);
            setLoading(false);
        }
    }

    function getShows(type, page) {
        return getRequest(`/shows/${type}?page=${page}`);
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
                <Button fluid={windowWidth < 768} className="discover__load-btn" primary content="Load More"
                        onClick={async e => {
                            if (resultType === 'search') {
                                const {data} = await postRequest(`/shows/search?page=${page + 1}`, {query: value});
                                setShows([...shows, ...data]);
                            } else {
                                const {data} = await getShows(resultType, page + 1);
                                setShows([...shows, ...data]);
                            }
                            setPage(page + 1);
                            e.target.blur();
                        }}/>
            </div>
        );
        return renderNoResults();
    }

    return (
        <div className="discover" id="discover">
            <section className="discover__header">
                <Divider hidden fitted/>
                <Header as="h1" className="discover__title">Discover</Header>
                <Menu secondary fluid stackable className="discover__menu">
                    <Menu.Item className="discover__search-item">
                        <Input icon="search" placeholder="Search..." value={value} onChange={onInputChange}
                               onFocus={() => {
                                   onResultChange('search');
                               }}/>
                    </Menu.Item>
                    <Menu.Item
                        className="discover__item"
                        name="trending"
                        active={resultType === 'trending'}
                        onClick={(e, {name}) => {
                            onResultChange(name);
                        }}
                        color="blue"
                    />
                    <Menu.Item
                        className="discover__item"
                        name="top"
                        active={resultType === 'top'}
                        content="Top Rated"
                        onClick={(e, {name}) => {
                            onResultChange(name);
                        }}
                        color="blue"
                    />
                </Menu>
            </section>
            {renderShows()}
        </div>
    );
}

export default SearchPage;