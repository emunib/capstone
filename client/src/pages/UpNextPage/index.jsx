import React, {useEffect, useState} from 'react';
import './style.scss';
import {Divider, Header, Icon, Item, Loader, Segment} from 'semantic-ui-react';
import Episode from '../../components/Episode';
import {getRequest, patchRequest} from '../../utils/axiosClient';

function UpNextPage() {
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getNextEpisodes() {
        const {data} = await getRequest('/myshows/episodes/next');
        setEpisodes(data);
    }

    async function init() {
        setLoading(true);
        await getNextEpisodes();
        setLoading(false);
    }

    useEffect(() => {
        init();
    }, []);

    function renderShows() {
        if (episodes.length) {
            return episodes.map(ep =>
                <Segment key={ep.id}>
                    <Header as="h2" content={ep.showName} textAlign="center"/>
                    <Item.Group divided stackable>
                        <Episode withBtn={true} episode={ep} clickHandler={async () => {
                            await setEpisodeWatched(ep.showId, ep.seasonNum, ep.episodeNum);
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
        }
    }

    async function setEpisodeWatched(id, sNum, eNum) {
        await patchRequest(`/myshows/${id}/seasons/${sNum}/episodes/${eNum}`, {watched: true});
        await getNextEpisodes();
    }

    return (
        <>
            <Divider hidden fitted/>
            <Header as="h1" textAlign="center">Up Next</Header>
            {loading ? <Loader active inline="centered" className="up-next__loader"/> : renderShows()}
        </>
    );
}

export default UpNextPage;