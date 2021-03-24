const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => res.render('pages/login'));

/* create table users(
  username varchar(10) not null,
  password varchar(20) not null,
  email varchar(30) not null,
  type varchar(10) not null,
  primary key(username)
);*/

/* create table usersdata(
  userid varchar(10),
  difficulty varchar(10) not null,
  time varchar(10) not null,
  score int not null,
  datetime date not null,
  foreign key (user) references users(username)
);*/

/*insert into users values( 'kevinMa', '123456', 'wengehuastudy2016@gmail.com', 'admin');*/

/*insert into users values( 'dezhengZhong', '123456', 'zdz14155023@gmail.com', 'admin');*/

/*insert into users values( 'meikoMi', '123456', 'meiko19617336@gmail.com', 'admin');*/

/*insert into users values( 'sn3an', '123456', 'sunzhijie1998@gmail.com', 'admin');*/

/*insert into users values( 'inhwamo', '123456', 'inhwa2000@gmail.com', 'admin');*/