// Take router of index.js from components folder.
const router = require("./components")

// Import cookie parser.
const cookieParser = require('cookie-parser')

// Take db of index.js from models folder.
const db = require("./models/index")

// Import express.
const express = require("express")

// Import cors.
const cors = require('cors')

// Create app for setting and starting app.
const app = express()

// Import the error handler class from middleware.
const errorHandlerMiddleware = require('./middleware/error-handler')

// Middleware for parsing cookie.
app.use(cookieParser())

// Set cors.
app.use(
    cors({
        origin: '*',
        credentials: true,
        exposedHeaders: ['Set-Cookie', 'X-Total-Count', 'authorization']
    })
)

// Middleware for parsing json.
app.use(express.json())

// Set the headers.
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})

// Give path for main router.
app.use("/api/v1/banking-app", router)

// Add middleware on app level for handling errors.
app.use(errorHandlerMiddleware)

// Start the app by listening on port.
const startApp = () => {
    let port = 4000
    app.listen(port, console.log(`server starting at port: ${port}`))
}
startApp()