const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 1234

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/messages', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});