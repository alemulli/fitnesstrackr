require("dotenv").config()
const express = require("express")
const cors = require('cors')
const app = express()

app.use(cors())

// Setup your Middleware and API Router here
const morgan = require('morgan');
app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
})

const router = require('./api');
app.use('/api', router);

router.use((err, req, res, next) => {
    console.error("SERVER ERROR: ", err)
    if (res.statusCode < 400) res.status(500)
    res.send({error: error.message, name: error.name, message: error.message, table: error.table})
  })
module.exports = app;
