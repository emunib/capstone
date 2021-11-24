import './App.scss';
import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <SearchPage/>
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
