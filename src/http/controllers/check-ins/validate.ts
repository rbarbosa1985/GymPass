import { makeValidateCheckInUseCase } from '@/services/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    checkInId: z.string().uuid()
  })

  const { checkInId } = createCheckInParamsSchema.parse(request.params)


  const validateCheckIn = makeValidateCheckInUseCase();
  await validateCheckIn.execute({
    checkInId
  })



  return reply.status(204).send()
}
