import './App.scss';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import MyShowsPage from './pages/MyShowsPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <Redirect to="/search"/>
                </Route>
                <Route path="/search">
                    <SearchPage/>
                </Route>
                <Route path="/myshows">
                    <MyShowsPage/>
                </Route>
                <Route exact path="/404">
                    <NotFoundPage/>
                </Route>
                <Route>
                    <Redirect to="/404"/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
