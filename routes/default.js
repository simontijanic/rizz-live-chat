const express = require('express');
const router = express.Router();
const userModel = require(`../models/userModel`);
const bcrypt = require('bcrypt');

router.post("/signup", async (req, res) => {
    const existingUser = await userModel.findOne({ name: req.body.name });
    
    if (existingUser) {
        return res.send("Username already taken, please choose another one.");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const data = {
        name: req.body.name,
        password: hashedPassword // Store hashed password
    };

    await userModel.insertMany([data]);
    res.render("login");
});

router.post("/login", async (req, res) => {
    try {
        const check = await userModel.findOne({ name: req.body.name });
        
        if (!check) {
            return res.send("User not found");
        }

        const isMatch = await bcrypt.compare(req.body.password, check.password);
        
        if (isMatch) {
            req.session.username = req.body.name;
            return res.render("index", { username: req.session.username });
        } else {
            return res.send("Wrong password");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.send("Wrong details");
    }
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/', (req, res) => {
    res.render('login');
});

module.exports = router;
