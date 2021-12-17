import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Link} from 'react-router-dom';
import {Card, Image} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Show(props) {
    const [hovering, setHovering] = useState(false);
    const [show, setShow] = useState(props.show);

    const toggleHover = () => setHovering(!hovering);

    const titleClass = () => {
        if (hovering) return 'show-card__title--hover';
        return '';
    };

    async function toggleFollowing() {
        let data;
        if (show.following) {
            data = (await axios.delete(`/myshows/${show.id}`)).data;
        } else {
            data = (await axios.post('/myshows', {id: show.id})).data;
        }

        setShow({...show, following: data.following});
    }

    return (
        <Card as={Link}
              to={`/shows/${show.id}`}
              className="show-card"
              raised
              onMouseEnter={toggleHover}
              onMouseLeave={toggleHover}
        >
            <Image className="show-card__img" src={show.img}/>
            <Card.Content>
                <Card.Header className={titleClass()} textAlign="center">{show.name}</Card.Header>
                <LoadingButton className="show-card__btn"
                               active={show.following}
                               icon="plus"
                               clickHandler={toggleFollowing}
                />
            </Card.Content>
        </Card>
    );
}

export default Show;