import React from 'react';
import './style.scss';
import {Item} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Episode({episode, onClick}) {
        return (
        <Item className="episode">
            <Item.Image className="episode__img" src={episode.img}/>

            <Item.Content>
                <Item.Meta className="episode__date">{(new Date(episode.date)).toDateString()}</Item.Meta>
                <Item.Header className="episode__title">{episode.name}</Item.Header>
                <Item.Meta className="episode__subtitle">{`${episode.showName} | S${episode.seasonNum}E${episode.episodeNum}`}</Item.Meta>
                <Item.Description>
                    <p>{episode.overview}</p>
                </Item.Description>
                <LoadingButton className="episode__btn" icon="check" onClick={onClick}/>
            </Item.Content>
        </Item>
    );
}

export default Episode;