import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { refresh } from './refresh'
import { register } from './register'

export async function usersRoutes(app: FastifyInstance) {
  // User Routes
  app.post('/users', register)

  // Authenticate Routes
  app.post('/sessions', authenticate)

  // Refresh Token
  app.patch('/token/refresh', refresh)

  // ** Authenticated  */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
