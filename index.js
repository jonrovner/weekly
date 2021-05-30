const express = require('express')
const app = express()
const path = require('path')

app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log(req)
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/api/random', async (req, res) => {
 
 res.send(req.query.number)  
})

app.listen(process.env.PORT || 3001)
