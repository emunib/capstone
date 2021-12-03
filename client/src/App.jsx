import './styles/global.scss';
import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {Container} from 'semantic-ui-react';
import NavBar from './components/NavBar';
import MyShowsPage from './pages/MyShowsPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/DiscoverPage';
import UpNextPage from './pages/UpNextPage';

function App() {
    return (
        <Router>
                <NavBar/>
                <Container as="main" className="main">
                    <Switch>
                        <Route exact path="/">
                            <Redirect to="/discover"/>
                        </Route>
                        <Route exact path="/discover">
                            <SearchPage/>
                        </Route>
                        <Route path="/next">
                            <UpNextPage/>
                        </Route>
                        <Route path="/shows">
                            <MyShowsPage/>
                        </Route>
                        <Route exact path="/404">
                            <NotFoundPage/>
                        </Route>
                        <Route>
                            <Redirect to="/404"/>
                        </Route>
                    </Switch>
                </Container>
            {/*<Segment as="footer" inverted basic> footer </Segment>*/}
        </Router>

    );
}

export default App;
