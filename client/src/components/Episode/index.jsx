import React, {useState} from 'react';
import './style.scss';
import {Button, Item} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Episode() {
    const wait = ms => new Promise(r => setTimeout(r, ms));


    return (
        <Item className="episode">
            <Item.Image size="tiny" src="https://image.tmdb.org/t/p/original/mpgDeLhl8HbhI03XLB7iKO6M6JE.jpg"/>

            <Item.Content>
                <Item.Meta className="episode__date">12/09/2020</Item.Meta>
                <Item.Header className="episode__title">Some Episode Title</Item.Header>
                <Item.Meta className="episode__subtitle">Wheel of Time | S1E1</Item.Meta>
                <Item.Description>
                    <p>
                        Many people also have their own barometers for what makes a cute
                        dog.
                    </p>
                </Item.Description>

                <LoadingButton className="episode__btn" icon="check" onClick={()=>wait(2000)}/>
            </Item.Content>
        </Item>
    );
}

export default Episode;