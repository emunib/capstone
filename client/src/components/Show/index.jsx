import axios from 'axios';
import React, {useState} from 'react';
import cx from 'classnames';
import './style.scss';

function Show({show}) {
    const [following, setFollowing] = useState(show.following);

    async function onClick() {
        if (following) {
            await axios.delete(`/myshows/${show.id}`);

        } else {
            await axios.post(`/myshows/${show.id}`, {following: true});
            alert('done');
        }
        setFollowing(!following);
    }

    return (
        <div className={cx('show', {following: following})} onClick={onClick}>
            <h1>{show.name}</h1>
            <p>{show.following}</p>
            <img src={show.img} alt={show.name}/>
            <p>{show.overview}</p>
        </div>
    );
}

export default Show;