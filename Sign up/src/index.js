const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const User = require("./mongoose"); 

const templatePath = path.join(__dirname, '../templates');


app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).send("Invalid email format");
        }
        
        if (req.body.password !== req.body.confirm_password) {
            return res.status(400).send("Passwords do not match");
        }

        
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });
        
        await newUser.save();
        res.render("signupmsg");
    } catch (error) {
        console.error('Error inserting user:', error);
        res.status(500).send('Error signing up');
    }
});

app.post("/login", async (req, res) => {
    try {
        
        const user = await User.findOne({ username: req.body.username, password: req.body.password });
        if (user) {
            res.render("loginmsg");
        } else {
            res.send("Wrong username or password");
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
