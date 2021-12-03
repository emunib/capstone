import React from 'react';
import './style.scss';
import {NavLink} from 'react-router-dom';
import {Button, Container, Menu, Segment} from 'semantic-ui-react';

function NavBar() {
    return (
        <Segment inverted basic>
            <Container>
                <Menu secondary inverted as="nav">
                    <Menu.Item color="blue" as={NavLink} to="/discover">Discover</Menu.Item>
                    <Menu.Item color="blue" as={NavLink} to="/shows">My Shows</Menu.Item>
                    <Menu.Item color="blue" as={NavLink} to="/next">Up Next</Menu.Item>

                    <Menu.Menu position="right">
                        <Menu.Item fitted={true}>
                            <Button>Sign Out</Button>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
            </Container>
        </Segment>
    );
}

export default NavBar;