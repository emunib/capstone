import axios from 'axios';
import React, {useState} from 'react';
import './style.scss';
import {Link} from 'react-router-dom';
import {Card, Image} from 'semantic-ui-react';
import LoadingButton from '../LoadingButton';

function Show({show: showProp}) {
    const [hovering, setHovering] = useState(false);
    const [show, setShow] = useState(showProp);

    const toggleHover = () => setHovering(!hovering);

    const titleClass = () => {
        if (hovering) return 'show-card__title--hover';
        return '';
    };

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
                               icon="plus" clickHandler={
                    async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (show.following) {
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