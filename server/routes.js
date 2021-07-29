const {Router} = require('express')
const geo = require('../geo.json')

module.exports = app => {
  const router = new Router()

  router.get('/bal/:balId/communes/:codeCommune/voies/:idVoie', (request, res) => {
    app.render(request, res, '/bal/voie', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
      idVoie: request.params.idVoie,
    })
  })

  router.get('/bal/:balId/communes/:codeCommune/toponymes/:idToponyme', (request, res) => {
    app.render(request, res, '/bal/toponyme', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
      idToponyme: request.params.idToponyme,
    })
  })

  router.get('/bal/:balId/communes/:codeCommune', (request, res) => {
    app.render(request, res, '/bal/commune', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
    })
  })

  router.get('/bal/:balId/:token', (request, res) => {
    app.render(request, res, '/bal', {
      ...request.query,
      balId: request.params.balId,
      token: request.params.token,
    })
  })

  router.get('/bal/:balId', (request, res) => {
    app.render(request, res, '/bal', {
      ...request.query,
      balId: request.params.balId,
    })
  })

  router.get('/dashboard/departement/:codeDepartement', (request, res) => {
    app.render(request, res, '/dashboard/departement', {
      ...request.query,
      codeDepartement: request.params.codeDepartement,
    })
  })

  router.get('/geo/:location', (request, res) => {
    const {location} = request.params

    if (!(location in geo)) {
      return res.sendStatus(404)
    }

    return res.send(geo[location])
  })

  router.get('*', (request, res) => {
    app.render(request, res, request.params[0], request.query)
  })

  return router
}
