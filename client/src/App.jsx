import './styles/global.scss';
import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {Container} from 'semantic-ui-react';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import MyShowsPage from './pages/MyShowsPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/DiscoverPage';
import ShowDetailsPage from './pages/ShowDetailsPage';
import UpNextPage from './pages/UpNextPage';

function App() {
    const [authed, setAuthed] = useState();
    const [loading, setLoading] = useState(); // TODO: IMPLEMENT THIS, SO YOU DON'T SEE FLASH OF LOGIN FORM

    useEffect(() => {
        axios.get('/user').then(({data}) => {
            if (data.user) {
                setAuthed(true);
            } else {
                setAuthed(false);
            }
        });
    }, []);// TODO: SEMANTIC TAGS

    return (
        <Router>
            {authed && <NavBar authHandler={setAuthed}/>}
            <Container as="main" className="main">
                <Switch>
                    <Route exact path="/">
                        {authed ? <Redirect to="/discover"/> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/login">
                        {authed ? <Redirect to="/"/> : <LoginPage authHandler={setAuthed}/>}
                    </Route>
                    <Route exact path="/discover">
                        {authed ? <SearchPage/> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/next">
                        {authed ? <UpNextPage/> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/shows">
                        {authed ? <MyShowsPage/> : <Redirect to="/login"/>}
                    </Route>
                    <Route exact path="/shows/:id">
                        {authed ? <ShowDetailsPage/> : <Redirect to="/login"/>}
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
