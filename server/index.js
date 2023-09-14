const express = require('express')
const next = require('next')
const compression = require('compression')
require('dotenv').config()

const createRoutes = require('./routes')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const nextAppRequestHandler = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use(express.static('public')) // Serve favicon.ico

  server.use('/', createRoutes(app))

  server.use(async (req, res) => {
    await nextAppRequestHandler(req, res)
  })

  server.listen(port, err => {
    if (err) {
      throw err
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
