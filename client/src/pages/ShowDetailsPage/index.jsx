import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './style.scss';
import {useParams} from 'react-router-dom';
import {Dropdown, Header, Image, Item} from 'semantic-ui-react';
import Episode from '../../components/Episode';

function ShowDetailsPage() {
    const {id} = useParams();
    const [show, setShow] = useState();
    const [season, setSeason] = useState();

    useEffect(() => {
        loadShow();
    }, []);

    async function loadShow() {
        const {data} = await axios.get(`/shows/${id}`);
        setShow(data);
        if (data.seasons.length) {
            setSeason(data.seasons[0].seasonNum);
        }
    }

    function changeSeason(num) {
        setSeason(num);
    }

    function renderShow() {
        if (show && season >= 0) {
            const options = show.seasons.map(({name, seasonNum}) => ({key: seasonNum, value: seasonNum, text: name}));
            return (
                <div>
                    <Image src={show.img} size="medium"/>
                    <div>
                        <Header as="h1" content={show.name}/>
                        <Header as="h3" content={season}/>
                        <p>{show.overview}</p>
                    </div>
                    <Dropdown
                        onChange={(e, {value}) => {
                            changeSeason(value);
                        }}
                        selection
                        placeholder="Choose a season..."
                        options={options}
                        {...(options.length ? {defaultValue: options[0].value} : {})}
                    />
                    <Item.Group divided unstackable>
                        {show.seasons.find(s => s.seasonNum === season).episodes.map(ep => (
                            <Episode key={ep.id} episode={{...ep, seasonNum: season, showName: show.name}} withBtn={show.following}/>
                        ))}
                    </Item.Group>
                </div>
            );
        }
    }

    return (
        <>
            {renderShow()}
        </>
    );
}

export default ShowDetailsPage;