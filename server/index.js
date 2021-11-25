require('dotenv').config();
const {PORT} = process.env;
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/search', require('./routes/search'))
app.use('/popular', require('./routes/popular'))
app.use('/myshows', require('./routes/myshows'))

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});