require('dotenv').config();
const {PORT} = process.env;
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});