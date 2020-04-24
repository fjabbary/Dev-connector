const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator/check')
const config = require('config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// @/api/auth
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    }

    catch (err) {
        clg(err.message)

    }
})


//@route     POST api/auth
//@desc      Authenticate user & get Token
//@access    Public

router.post('/', [
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Password is required').exists()

], async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] })
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtToken'), { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        })

    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }
})


module.exports = router;
