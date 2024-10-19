const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// import bcrypt, { compare, hash } from "bcrypt";
const bcrypt = require('bcrypt');
const compare = bcrypt.compare;
const hash = bcrypt.hash;
const saltRounds = 10;
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/assignment_7');

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);


const app = express();
let port = 3000;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname,'public','index.html'));
});

app.get('/about', (req, res, next) => {
    res.render('about');
});

app.get('/login', (req, res, next) => {
    res.render('login');
});


app.get('/register', (req, res, next) => {
    res.render('register');
});

app.post('/login_in', async(req, res) => {
    // find data in database
    let data = await User.find({email : req.body.id});
    if(data.length == 0){
        res.render('login',{error : "Invalid email or password"});
    }
    else{
        let result = await compare(req.body.password, data[0].password);
        if(result){
            res.render('dashboard',{id : data[0].email, user : data[0].name});
        }
        else{
            res.render('login',{error : "Invalid email or password"});
        }
    }
});

app.post('/register_in', async(req, res) => {
    // add to database
    let hash = await bcrypt.hash(req.body.password,saltRounds);
    let newUser = new User({
        name : req.body.name,
        email : req.body.email,
        password : hash
    });
    newUser.save().then(()=>{
        console.log('User added');
    }).catch(()=>{
        console.log('User not added');
    });
    // console.log(req.body.name, req.body.password, req.body.email);
    res.render('login');
}
);

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`);
})