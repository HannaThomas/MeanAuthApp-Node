//all the modules(given in dependencies)
const express=require('express');
const path =require('path');
const bodyParser= require('body-parser');
const cors= require('cors');
const mongoose=require('mongoose');
const passport=require('passport');

const app= express();

const users=require('./routes/users');
const config=require('./config/database');
mongoose.connect(config.database);
//mongoose.connect(config.database, {useMongoClient: true})
mongoose.connection.on('connected',()=>{
    console.log('Connected to database '+config.database);
});

//Port number
const port=process.env.PORT || 8080;//3000;

//Cors middleware
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname,'public')));


//body parse middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users',users);


//Index route
app.get('/',(req,res)=>{
        res.send("Invalid endpoint");
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
});

//Start server
app.listen(port, ()=>{
    console.log('Server started at port '+port );
});