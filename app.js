const express = require("express");
const app = express();
const path = require("path");
const router = require('./routes/router');
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
const session = require('express-session');
const mysqlstore = require('express-mysql-session')(session);
require('dotenv').config();

// Establece a EJS como el motor de vistas
app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
// Indica los directorios de recursos del proyecto
app.use(express.static("./assets"));


// Middleware
app.use(morgan('dev'));
app.use(express.json());
var sessionStore = new mysqlstore({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME,
    port     : process.env.DB_PORT
});

app.use(session({
    secret: '1234567890',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}));
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
