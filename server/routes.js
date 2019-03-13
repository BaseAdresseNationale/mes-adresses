const {Router} = require('express')

module.exports = app => {
  const router = new Router()

  router.get('/bal/:id', (req, res) => {
    app.render(req, res, '/bal', {
      ...req.query,
      id: req.params.id
    })
  })

  router.get('/bal/:id/communes/:codeCommune', (req, res) => {
    app.render(req, res, '/bal/commune', {
      ...req.query,
      id: req.params.id,
      codeCommune: req.params.codeCommune
    })
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
