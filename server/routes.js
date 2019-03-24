const {Router} = require('express')

module.exports = app => {
  const router = new Router()

  router.get('/bal/:balId/communes/:codeCommune/voies/:idVoie', (req, res) => {
    app.render(req, res, '/bal/voie', {
      ...req.query,
      balId: req.params.balId,
      codeCommune: req.params.codeCommune,
      idVoie: req.params.idVoie
    })
  })

  router.get('/bal/:balId/communes/:codeCommune', (req, res) => {
    app.render(req, res, '/bal/commune', {
      ...req.query,
      balId: req.params.balId,
      codeCommune: req.params.codeCommune
    })
  })

  router.get('/bal/:balId', (req, res) => {
    app.render(req, res, '/bal', {
      ...req.query,
      balId: req.params.balId
    })
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
