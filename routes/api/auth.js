const express = require('express')
const router = express.Router();

// @/api/auth
router.get('/', (req, res) => {
    res.send('Auth Route')
})

module.exports = router;
