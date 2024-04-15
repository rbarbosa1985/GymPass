import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { create } from './create'
import { history } from './history'
import { metrics } from './metrics'
import { validate } from './validate'

export async function checkInRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', create)
  app.get('/check-ins/history', history)
  app.patch('/check-ins/:checkInId/validate', { onRequest: [verifyUserRole('ADMIN')] }, validate)
  app.get('/check-ins/metrics', metrics)
}
