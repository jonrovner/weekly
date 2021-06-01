require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')

app.use(express.static('public'))

app.get('/', (req, res) => {
    console.log(req)
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/api/random', async (req, res) => {

    try {
        const queryString = `https://api.spoonacular.com/recipes/random?number=${req.query.number}&tags=${req.query.tags}&apiKey=${process.env.APIKEY}`
        console.log(queryString)
        const data = await fetch(queryString)
        const results = await data.json() 
        
        res.json(results)
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        })
        }
})

app.get('/api/search', async (req, res) => {
    try {
        const queryString = `https://api.spoonacular.com/recipes/complexSearch?query=${req.query.word}&number=12&addRecipeInformation=true&diet=${req.query.diet}&cuisine=${req.query.cuisine}&type=${req.query.type}&apiKey=${process.env.APIKEY}`
        console.log(queryString)
        const data = await fetch(queryString)
        const results = await data.json()
        res.json(results)
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: err.message,
        })
    }
})

app.get('/api/:id', async (req, res) => {
    try {
        const queryString = `https://api.spoonacular.com/recipes/${req.params.id}/information?&apiKey=${process.env.APIKEY}`
        const data = await fetch(queryString)
        const results = await data.json()
        res.json(results)
    } catch (err) {
        return res.status(500).json({
        success: false,
        message: err.message,
        
    })
    }
})

app.listen(process.env.PORT || 3001)
