import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Button, Card, Image} from 'semantic-ui-react';

function Show({show}) {
    const [following, setFollowing] = useState(show.following);
    const [hovering, setHovering] = useState(false);

    async function onClick() {
        if (following) {
            show.following = false;
            await axios.delete(`/myshows/${show.id}`);

        } else {
            show.following = true;
            await axios.post(`/myshows/${show.id}`, show);
        }
        setFollowing(!following);
    }

    const toggleHover = () => setHovering(!hovering);

    const cardColor = () => {
        if (hovering) return 'blue';
        if (following) return 'yellow';
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
                <Button className="show-card__btn"
                        icon="plus"
                        onClick={onClick}
                        color={following ? 'yellow' : ''}/>
            </Card.Content>
        </Card>
    );
}

export default Show;