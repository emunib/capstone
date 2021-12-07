import axios from 'axios';
import React from 'react';
import './style.scss';
import {NavLink, useHistory} from 'react-router-dom';
import {Button, Container, Menu, Segment} from 'semantic-ui-react';

function NavBar({authHandler}) {
    axios.get('/user').then(data => {
        console.log(data);
    });
    return (
        <Segment inverted basic>
            <Container>
                <Menu secondary inverted as="nav" stackable className="nav">
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/discover">Discover</Menu.Item>
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/shows">My Shows</Menu.Item>
                    <Menu.Item className="nav__link" color="blue" as={NavLink} to="/next">Up Next</Menu.Item>

                    <Menu.Menu position="right">
                        <Menu.Item className="nav__btn-item">
                            <Button fluid className="nav__btn" onClick={() => {
                                axios.post('/user/logout').then(() => {
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