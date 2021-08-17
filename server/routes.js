const {Router} = require('express')
const geo = require('../geo.json')

module.exports = app => {
  const router = new Router()

  router.get('/bal/:balId/communes/:codeCommune/voies/:idVoie', (request, response) => {
    app.render(request, response, '/bal/voie', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
      idVoie: request.params.idVoie,
    })
  })

  router.get('/bal/:balId/communes/:codeCommune/toponymes/:idToponyme', (request, response) => {
    app.render(request, response, '/bal/toponyme', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
      idToponyme: request.params.idToponyme,
    })
  })

  router.get('/bal/:balId/communes/:codeCommune', (request, response) => {
    app.render(request, response, '/bal/commune', {
      ...request.query,
      balId: request.params.balId,
      codeCommune: request.params.codeCommune,
    })
  })

  router.get('/bal/:balId/:token', (request, response) => {
    app.render(request, response, '/bal', {
      ...request.query,
      balId: request.params.balId,
      token: request.params.token,
    })
  })

  router.get('/bal/:balId', (request, response) => {
    app.render(request, response, '/bal', {
      ...request.query,
      balId: request.params.balId,
    })
  })

  router.get('/dashboard/departement/:codeDepartement', (request, response) => {
    app.render(request, response, '/dashboard/departement', {
      ...request.query,
      codeDepartement: request.params.codeDepartement,
    })
  })

  router.get('/geo/:location', (request, response) => {
    const {location} = request.params

    if (!(location in geo)) {
      return response.sendStatus(404)
    }

    return response.send(geo[location])
  })

  router.get('*', (request, response) => {
    app.render(request, response, request.params[0], request.query)
  })

  return router
}
