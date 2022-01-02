import React, {useEffect, useState} from 'react';
import './style.scss';
import {NavLink} from 'react-router-dom';
import {Button, Container, Menu, Segment} from 'semantic-ui-react';
import {getRequest, postRequest} from '../../utils/axiosClient';

function NavBar({authHandler}) {
    const [email, setEmail] = useState('');

    useEffect(() => {
        getRequest('/user').then(({data}) => {
            if (data.user) {
                setEmail(data.user.username);
            } else {
                setEmail('');
            }
        });

    }, []);
    return (
        <Segment inverted basic>
            <Container>
                <Menu secondary inverted as="nav" stackable className="nav">
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/discover">Discover</Menu.Item>
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/shows">My Shows</Menu.Item>
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/next">Up Next</Menu.Item>

                    <Menu.Menu position="right">
                        <Menu.Item color="white" className="nav__link">{email}</Menu.Item>
                        <Menu.Item className="nav__btn-item">
                            <Button fluid className="nav__btn" onClick={() => {
                                postRequest('/user/logout').then(() => {
                                    authHandler();
                                });
                            }}>Sign Out</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Container>
        </Segment>
    );
}

export default NavBar;