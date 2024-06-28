const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require("cors");


const app = express();
app.use(bodyParser.json({limit: '70mb'}));
app.use(bodyParser.urlencoded({limit: '70mb', extended: false, parameterLimit: 1000000}));


//for login
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//CORS OPTIONS
const corsOptions = {
      origin: '*',
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 204,
    };
app.use(cors(corsOptions));

const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});


// const router = require('./app/routers/index.js');
// app.use('/', router);
const router = require("./router");
app.use("/api", router);


const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}`);
});
