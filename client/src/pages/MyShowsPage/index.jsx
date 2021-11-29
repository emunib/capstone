import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {Item} from 'semantic-ui-react';
import Episode from '../../components/Episode';
import LoadingButton from '../../components/LoadingButton';
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

    const [activeIndex, setActiveIndex] = useState();

    function handleClick(e, titleProps) {
        const {index} = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }

    return (
        <>
            <h1>MyShowsPage</h1>

            {/*{renderShows()}*/}
            {/*<Accordion fluid styled>*/}
            {/*    <Accordion.Title*/}
            {/*        active={activeIndex === 0}*/}
            {/*        index={0}*/}
            {/*        onClick={handleClick}*/}
            {/*    >*/}
            {/*        <Icon name="dropdown"/>*/}
            {/*        What is a dog?*/}
            {/*        <Button icon="plus" onClick={event => {*/}
            {/*            event.stopPropagation();*/}
            {/*        }}/>*/}
            {/*    </Accordion.Title>*/}
            {/*    <Accordion.Content active={activeIndex === 0}>*/}
            {/*        <p>*/}
            {/*            A dog is a type of domesticated animal. Known for its loyalty and*/}
            {/*            faithfulness, it can be found as a welcome guest in many households*/}
            {/*            across the world.*/}
            {/*        </p>*/}
            {/*    </Accordion.Content>*/}
            {/*</Accordion>*/}
            <Item.Group divided unstackable>

                <Episode/>
                <Episode/>
                <Episode/>
            </Item.Group>
        </>
    );
}

export default MyShowsPage;