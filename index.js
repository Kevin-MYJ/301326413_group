const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
var app = express();

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
  // ssl: true,
});
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));


// determine = -1 means 第一次进入
// determine = 0 means 注册事务
// determine = 1 means 登录事务
// determine = 2 means 登出事务
app.get('/', (req, res) => {
  res.render("pages/login", { 'determine': -1 });
});

app.post("/update", async (req, res) => {
  var name = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var judg_name = "new";
  var judg_email = "new";
  var client = await pool.connect();
  var check_user = await client.query(
    `SELECT * FROM users where username = '${name}';`
  );
  console.log(check_user.rowCount);
  if (check_user.rowCount >= 1) {
    err = "Username already existed!";
    res.render("pages/login", {'determine': 0, 'signupMessage': err});
    return;
  }
  var check_email = await client.query(
    `SELECT * FROM users WHERE email = '${email}';`
  );
  if (check_email.rowCount >= 1) {
    err = "email already existed!";
    res.render("pages/login", { 'determine': 0, 'signupMessage': err });
    return;
  }
  if (judg_name == "new" && judg_email == "new") {
    var insertQuery = await client.query(
      `INSERT INTO users(username, password, email, type)VALUES('${name}', '${password}', '${email}', 'user');`
    );
    res.render("pages/login", { 'determine': 0, 'signupMessage': ""});
  }
  client.release();
});

app.post("/login", (req, res) =>{
  var user = req.body.usernameIn;
  res.render("pages/sudoku", {'name':user});
});

app.post("/sudoku", async(req, res)=>{
  var user = req.body.player;
  var diff = req.body.difficult;
  var time = req.body.timer;
  var score = parseInt(req.body.result);
  console.log("player is "+user);
  console.log("difficultly is "+diff);
  console.log("time is "+time);
  console.log("Result is "+score);
  // let sec = parseInt(time) % 60;
  // let min = parseInt(parseInt(time) / 60);
  // let trueTime = min + ":" + sec;
  var date = new Date();
  var dateTime = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  console.log(dateTime);

  var client = await pool.connect();
  // var recordQuery = await client.query(`insert into usersdata values ('${name}', '${diff}', '${trueTime}', ${score}, ${dateTime})`);
  var recordQuery = await client.query(`insert into usersdata values ('${user}', '${diff}', '${time}', ${score}, '${dateTime}')`);
  res.render("pages/sudoku", { 'name': user });
  client.release();
});

app.post("/signout", (req,res)=>{
  res.render("pages/login", { 'determine': 2 });
});

app.post("/:name/grade", async (req, res)=>{
  var user = req.params.name;
  console.log("grade :"+user);
  var client = await pool.connect();
  var selectQuery = await client.query(`select difficulty, time, score, datetime from usersdata where userid = '${user}' order by datetime desc`);
  console.log(selectQuery.rows);
  console.log(typeof selectQuery.rows);
  var results = {'name' : user, 'data': selectQuery.rows};
  res.render('pages/userGrade', results);
  client.release();
});

app.post("/sudoku1", (req, res)=>{
  var user = req.body.user;
  res.render("pages/sudoku", {'name':user});
});

/* create table users(
  username varchar(20) not null,
  password varchar(20) not null,
  email varchar(30) not null,
  type varchar(10) not null,
  primary key(username)
);*/

/* create table usersdata(
  userid varchar(20),
  difficulty varchar(10) not null,
  time varchar(10) not null,
  score int not null,
  datetime varchar(50) not null,
  foreign key (userid) references users(username)
);*/

/*insert into users values( 'kevinMa', '123456', 'wengehuastudy2016@gmail.com', 'admin');*/

/*insert into users values( 'dezhengZhong', '123456', 'zdz14155023@gmail.com', 'admin');*/

/*insert into users values( 'meikoMi', '123456', 'meiko19617336@gmail.com', 'admin');*/

/*insert into users values( 'sn3an', '123456', 'sunzhijie1998@gmail.com', 'admin');*/

/*insert into users values( 'inhwamo', '123456', 'inhwa2000@gmail.com', 'admin');*/