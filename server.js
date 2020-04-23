const express = require('express')
const app = express();
const connectDB = require('./config/db')

connectDB();

app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('app is running on port ' + PORT)
})

