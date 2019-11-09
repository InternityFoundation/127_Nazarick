const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require('passport');



//body parser
// app.use(express.bodyParser({limit: '50mb'}));
// app.use(express.static("public"))
app.use(express.urlencoded({ extended: false,limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
//mongodb connect
const db = require("./config/keys").mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err))

//routes
const children = require("./routes/children");
const users = require("./routes/users");

//passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//routes middleware
app.use("/api/users", users);
app.use("/api/children", children);
app.get('/', (req, res) => res.json({ msg: 'This is test route ' }));

app.use(express.static("public"));
//ml moddleware
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// app.use(express.static("public"));

const port = process.env.PORT || 8500;

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server started on port ${port}`);
    }
})