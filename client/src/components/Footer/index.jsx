import React from 'react';
import './style.scss';
import {Container, Divider, Image} from 'semantic-ui-react';
import logo from '../../assets/logos/TMDB.svg';

function Footer() {
    return (
        <Container className="footer">
            <Divider fitted className="footer__divider"/>
            <Divider hidden/>
            <Image className="footer__link" as="a" src={logo}
                   href="https://www.themoviedb.org/"/>
            <Divider hidden/>
        </Container>
    );
}

export default Footer;