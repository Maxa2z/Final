const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// import bcrypt, { compare, hash } from "bcrypt";
const bcrypt = require('bcrypt');
const compare = bcrypt.compare;
const hash = bcrypt.hash;
const saltRounds = 10;
const mongoose = require('mongoose');
const axios = require('axios');

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

app.get('/Wea', (req, res, next) => {
    res.render('Weather',{data : ""});
});

app.get('/Weather', async(req, res, next) => {
    let api = 'mwmhIrLoVSndCqh1YfeIBm6E98cLBU0W';
    let city = 'Guntur';
    let lat = '16.314209';
    let lon = '80.435028';
    try {
        const response = await axios.get(`https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${api}`);
        const weatherData = response.data;
        res.render('Weather', { weather: weatherData });
      } catch (error) {

        res.status(500).send(`${error}`);
      }
});


app.get('/Delete/:id', (req, res, next) => {
    let id = req.params.id;
    User.deleteOne({email : id},(err) => {
        if(err){
            console.log(err);
            alert('User not deleted');
        }
        else{
            console.log('User deleted');
            res.render('login');
        }
    });
});

app.get('/register', (req, res, next) => {
    res.render('register');
});

app.get('/Currency', (req, res, next) => {
    res.render('Currency',{rate : ""});
});

app.post('/Curr', async(req, res) => {
    // retrive data from form
    console.log(req.body.fromCurrency, req.body.toCurrency);

    axios.get(`https://exchange-rates.abstractapi.com/v1/live/?api_key=a3c34a5dd61543ed9803137265bb1ed6&base=${req.body.fromCurrency}&target=${req.body.toCurrency}`)
    .then((response) => {
        res.render('Currency',{from: 1.0 ,rate : response.data.exchange_rates[req.body.toCurrency]});
    })
    .catch((error) => {
        console.error("error");
    });
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