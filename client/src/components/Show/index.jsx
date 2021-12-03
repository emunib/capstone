import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Button, Card, Image} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Show({show, onClick}) {
    const [hovering, setHovering] = useState(false);

    const toggleHover = () => setHovering(!hovering);

    const cardColor = () => {
        if (hovering) return 'blue';
        if (show.following) return 'yellow';
        return 'white';
    };

    return (
        <Card className="show-card"
              raised
              color={cardColor()}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}>
            <Image className="show-card__img" src={show.img}/>
            <Card.Content>
                <Card.Header>{show.name}</Card.Header>
                <LoadingButton className="show-card__btn"
                               icon="plus"
                               onClick={onClick}
                               active={show.following}
                />
            </Card.Content>
        </Card>
    );
}

export default Show;