import 'semantic-ui-css/semantic.min.css';
import './App.scss';
import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import {Container, Loader} from 'semantic-ui-react';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import MyShowsPage from './pages/MyShowsPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/DiscoverPage';
import ShowDetailsPage from './pages/ShowDetailsPage';
import UpNextPage from './pages/UpNextPage';
import {getRequest} from './utils/axiosClient';

function App() {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        setLoading(true);
        const {data} = await getRequest('/user');
        if (data.user) {
            setAuthed(true);
        } else {
            setAuthed(false);
        }
        setLoading(false);
    }

    function renderPage() {
        return (<>
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
            {authed && <Footer/>}
        </>);
    }

    return (
        <Router>
            {loading ? <Loader active inline="centered" className="app__loader"/> : renderPage()}
        </Router>

    );
}

export default App;
