import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Link} from 'react-router-dom';
import {Button, Card, Image} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Show({show: showProp, clickHandler}) {
    const [hovering, setHovering] = useState(false);
    const [show, setShow] = useState(showProp);

    const toggleHover = () => setHovering(!hovering);

    const cardColor = () => {
        if (hovering) return 'blue';
        if (show.following) return 'yellow';
        return 'white';
    };

    return (
        <Card as={Link}
              to={`/shows/${show.id}`}
              className="show-card"
              raised
              color={cardColor()}
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
        >
            <Image className="show-card__img" src={show.img}/>
            <Card.Content>
                <Card.Header>{show.name}</Card.Header>
                <LoadingButton className="show-card__btn"
                               icon="plus" clickHandler={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (show.following) { // i love you
                        setShow((await axios.delete(`/myshows/${show.id}`)).data);
                    } else {
                        setShow((await axios.post('/myshows', {id: show.id})).data);
                    }
                }}
                               active={show.following}
                />
            </Card.Content>
        </Card>
    );
}

export default Show;