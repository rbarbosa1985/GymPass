import { makeCreateGymUseCase } from '@/services/factories/make-create-gym-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { title, description, phone, latitude, longitude } = registerBodySchema.parse(request.body)


  const createGym = makeCreateGymUseCase();
  await createGym.execute({
    title,
    description,
    phone,
    latitude,
    longitude
  })



  return reply.status(201).send()
}
