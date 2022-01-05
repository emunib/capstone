
# TV Tracker

A fully responsive web app that allows you to, once logged in to your account, search for tv shows as well as see the top rated and currently trending shows and their details. You can follow shows that shows your are watching. Additionally, you mark shows, seasons, or episodes as watched easily keep track of what you have seen and what is remaining. Lastly, you can see the next unwatched episode in all of your followed shows.

## Demo

A fully functional version of the app can be found at [https://emunib-tv-tracker.netlify.app/](https://emunib-tv-tracker.netlify.app/)

## Screenshots

![Show details](docs/screenshots/show.png?raw=true)

More [screenshots](docs/screenshots/screenshots.md).

## Tech Stack

**Client:** [React](https://reactjs.org/), [Semantic UI](https://react.semantic-ui.com/)

**Server:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/)

## Environment Variables

To run this project locally, you will need to add the following environment variables to a .env file located in the server dirctory:

```
PORT=8080
SESSION_SECRET=<Some random string>
DB_URI=<A MondoDB connection URI>
API_KEY=<TMDB API key>
```
The `DB_URI` can be any valid URI to a local or cloud based MongoDB database. A new, free, cloud based database can easily be set up at [MondoDB](https://www.mongodb.com/) after signing up.

The `API_KEY` can be obtained for free at [TMDB](https://www.themoviedb.org/) after signing up.

## Usage

To clone and run this project you will need [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/).

Also, you will need set up a .env file as shown above.

To run the project run the following:

```bash
# clone the repository
$ git clone https://github.com/emunib/capstone.git

# go into the server
$ cd capstone/server

# install server dependencies
$ npm install

# start the server
$ npm start

# go into the client
$ cd ../client

# install server dependencies
$ npm install

# start the client
$ npm start
```

You can go to [http://localhost:3000/](http://localhost:3000/) to use the app.

## Contact

This web app was designed and developed by Ehtasham Munib.

You can follow me on [GitHub](https://github.com/emunib/) and [LinkedIn](https://www.linkedin.com/in/emunib/).
