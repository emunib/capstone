import React from 'react';
import './style.scss';
import {Header, Icon} from 'semantic-ui-react';

function NotFoundPage() {
    return (
        <Header as="h3" icon color="grey" className="not-found">
            <Icon name="exclamation circle"/>
            404 Not Found
            <Header.Subheader>
                The page you requested could not be found
            </Header.Subheader>
        </Header>
    );
}

export default NotFoundPage;