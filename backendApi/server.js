const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config({path:'./config/config.env'});

//Connect to database
connectDB();

const app = express();

//Body Parser -- extracts the entire body portion of an incoming request stream and exposes it on req.body.
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//For SQL Injections -> Sanitize data
app.use(mongoSanitize());


//Dev loggin middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//File uploading
app.use(fileupload());

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in  ${process.env.NODE_ENV} on PORT ${PORT}`.yellow.bold));

//Handle unhandled promise Rejections
process.on('unhandledRejection',(err,promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server & exit processs
    server.close(() =>  process.exit(1));
})


