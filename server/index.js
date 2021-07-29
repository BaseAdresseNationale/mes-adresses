const express = require('express')
const next = require('next')
const compression = require('compression')

const createRoutes = require('./routes')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})

app.prepare().then(() => {
  const server = express()

  if (!dev) {
    server.use(compression())
  }

  server.use(express.static('public')) // Serve favicon.ico
  server.use('/', createRoutes(app))

  server.listen(port, error => {
    if (error) {
      throw error
    }

    console.log(`> Ready on http://localhost:${port}`)
  })
})
