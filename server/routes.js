const {Router} = require('express')
const geo = require('../geo.json')

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

  router.get('/bal/:balId/:token', (req, res) => {
    app.render(req, res, '/bal', {
      ...req.query,
      balId: req.params.balId,
      token: req.params.token
    })
  })

  router.get('/bal/:balId', (req, res) => {
    app.render(req, res, '/bal', {
      ...req.query,
      balId: req.params.balId
    })
  })

  router.get('/dashboard/departement/:codeDepartement', (req, res) => {
    app.render(req, res, '/dashboard/departement', {
      ...req.query,
      codeDepartement: req.params.codeDepartement
    })
  })

  router.get('/geo/:location', (req, res) => {
    const {location} = req.params

    if (!(location in geo)) {
      return res.sendStatus(404)
    }

    return res.send(geo[location])
  })

  router.get('*', (req, res) => {
    app.render(req, res, req.params[0], req.query)
  })

  return router
}
