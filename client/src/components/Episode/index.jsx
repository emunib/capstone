import React from 'react';
import './style.scss';
import {Item} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Episode({episode, clickHandler, withBtn}) {
    return (
        <Item className="episode">
            <Item.Image className="episode__img" rounded src={episode.img}/>

            <Item.Content>
                <Item.Meta className="episode__date">{(new Date(episode.date)).toLocaleDateString('en-US')}</Item.Meta>
                <Item.Header className="episode__title">{episode.name}</Item.Header>
                <Item.Meta
                    className="episode__subtitle">{`${episode.showName} | S${episode.seasonNum}E${episode.episodeNum}`}</Item.Meta>
                <Item.Description>
                    <p>{episode.overview}</p>
                </Item.Description>
                {withBtn && <LoadingButton active={episode.watched} className="episode__btn" icon="check" clickHandler={clickHandler}/>}
            </Item.Content>
        </Item>
    );
}

export default Episode;