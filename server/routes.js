const {Router} = require('express')

module.exports = app => {
  const router = new Router()

  router.get('/bal/:balId', (req, res) => {
    app.render(req, res, '/bal', {
      ...req.query,
      balId: req.params.balId
    })
  })

  router.get('/bal/:balId/communes/:codeCommune', (req, res) => {
    app.render(req, res, '/bal/commune', {
      ...req.query,
      balId: req.params.balId,
      codeCommune: req.params.codeCommune
    })
  })

  router.get('/bal/:balId/communes/:codeCommune/voies/:voieId', (req, res) => {
    app.render(req, res, '/bal/voie', {
      ...req.query,
      balId: req.params.balId,
      codeCommune: req.params.codeCommune,
      voieId: req.params.voieId
    })
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
