import { makeFetchUserCheckInsHistoryUseCase } from '@/services/factories/make-fetch-user-check-ins-history';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = searchGymsQuerySchema.parse(request.query)


  const fetchUserCheckInsHistory = makeFetchUserCheckInsHistoryUseCase();
  const { checkIns } = await fetchUserCheckInsHistory.execute({
    userId: request.user.sub,
    page
  })



  return reply.status(200).send({ checkIns })
}
