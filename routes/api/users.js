const express = require('express')
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

// @/api/users
router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'Please enter password more than 6 characters').isLength({ min: 6 })

], async (req, res) => {
    const errors = validationResult(req);
    const { name, email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        let user = await User.findOne({ email: email })
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
        }
        const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, salt)
        await user.save()

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
