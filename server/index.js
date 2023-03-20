const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const session=require('express-session');
const mysql=require('mysql2');
const path = require('path');
const cors=require('cors')
const filestore = require("session-file-store")(session)
const bodyParser = require("body-parser");
require('dotenv').config();



app.use( cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(session({
    secret:'asecret',
    saveUninitialized: true,
    resave: false,
    store: new filestore()
}));

app.use((req,res,next)=>{
    console.log(req.body,"session-> ",req.session);
    next();
})

const db = mysql.createConnection({
    // host:process.env.HOST,
    host:'localhost',
    // user:process.env.MYSQL_USER,
    user:'root',
    // password:process.env.PASSWORD,
    password:'rootpass',
    // database:process.env.DATABASE
    database:'toptrove'
})//fill it up

db.connect(function(err) {
if (err) {
    return console.error('error: ' + err.message);
}
console.log('Connected to the MySQL server.');
})


//home page routes
// app.get("/",(req,res)=>
// {

//   res.sendFile('register.html',{root:__dirname+'/client/pages'});

// });


app.post('/register',async(req,res)=>{

    const {username,password,fname,lname}=req.body;
    const hash=await bcrypt.hash(password,12);

    const query2="SELECT id from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,(err,result)=>{
        if(err)
        {
            console.log(err);
            res.sendStatus(403);
        }
        if(result.length!=0)
        {
            console.log('Username already exists');
            res.sendStatus(400)
        }
        else{
            const values=[username,hash,fname,lname];

            const query="INSERT INTO auth(`user_name`,`user_password`,`first_name`,`last_name`) values (?,?,?,?)"//change the table name,column name as per requirement
            db.query(query,values,(err,result)=>{
                if(err)
                {
                    console.log(err);
                    res.redirect('/register')
                }
                // console.log("result ",result);
                console.log('Account created for ',username);
                res.sendStatus(200);
            })
        }
    })
})


app.post('/login',async(req,res)=>{
    const {username,password}=req.body;
    console.log(username,password);

    const query2="SELECT id,user_password from auth where user_name=?"//change the table name,column name as per requirement

    db.query(query2,username,async (err,result)=>{
        if(err)
        {
            console.log(err);
            res.statusCode = 400;
            res.send("Invalid Details");
        }

        if(result.length==0)
        {
            console.log('first WRONG USERNAME OR PASSWORD');
            res.statusCode = 401;
            res.send("Unauthorized");
        }
        else{
            var userId=result[0].id || 0;
            var passwordhash=result[0].user_password || "";
                const validuser=await bcrypt.compare(password,passwordhash);
                if(validuser)
                {
                    req.session.user_id=userId;
                    console.log("valid",req.session);
                    // res.statusCode=200;
                    // res.send({success:true,userId});
                    res.send(req.session);
                }
                else{
                    res.statusCode=400;
                    res.send({success:false});
                }
            }
        }
    )
});

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    console.log('LOGGED OUT SUCCESSFULLY');
    res.sendStatus(200);
})

app.get('/dashboard',(req,res)=>{
    console.log('asking permision..');
    if(!req.session.user_id){
        console.log('NOT LOGGED IN');
        res.sendStatus(401);
    }
    else{
        res.sendStatus(200);
    }
})


app.get('*',(req,res)=>{
    res.sendStatus(404);
})



const port=process.env.PORT || 8880;

app.listen(port,()=>{
    console.log(`SESSION HEARING on ${port}..`);
})