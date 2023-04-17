const express = require("express");
const app = express();
const path = require("path");
const router = require('./routes/router');
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Establece a EJS como el motor de vistas
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
// Indica los directorios de recursos del proyecto
app.use(express.static("./assets"));


// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
// app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
// app.use(express.cookieParser('keyboard cat'));
app.use(myConnection(mysql,{
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
},'single'));

// Rutas
app.use('/', router);

const port = process.env.PORT || 4000;

app.listen(port, ()=>{
    console.log(`server running @ :${port}`);
});
