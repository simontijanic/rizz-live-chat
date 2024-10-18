const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log("Route works");
    res.render("index"); 
});

module.exports = router;
