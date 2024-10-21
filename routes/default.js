const express = require('express');
const router = express.Router();
const userModel = require(`../models/userModel`)
const mongoose = require(`mongoose`)

router.post("/signup",async (req, res)=>{

    const data = {
        name:req.body.name,
        password:req.body.password
    }

    await userModel.insertMany([data])

    res.render("login")

})

router.post("/login", async (req, res) => {
    try {
        const check = await userModel.findOne({ name: req.body.name });

        if (!check) {
            return res.send("User not found");
        }

        if (check.password === req.body.password) {
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
    res.render('signup')
})
router.get('/', (req, res) => {
    res.render('login')
})

module.exports = router;
