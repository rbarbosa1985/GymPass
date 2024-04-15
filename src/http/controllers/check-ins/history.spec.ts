import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Check-In History(e2e)', () => {

  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to list the history of check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: 'Academia do Zé',
        description: 'Academia do Zé, a melhor academia do Brasil',
        phone: '123456789',
        latitude: -27.2092052,
        longitude: -49.6401091,
      }
    })

    await prisma.checkIn.createMany({
      data:
        [{
          gym_id: gym.id,
          user_id: user.id
        },
        {
          gym_id: gym.id,
          user_id: user.id
        }]
    })

    const response = await request(app.server).
      get('/check-ins/history').
      set('Authorization', `Bearer ${token}`).
      send()

    expect(response.status).toEqual(200)
    expect(response.body.checkIns).toHaveLength(2)

  })
})