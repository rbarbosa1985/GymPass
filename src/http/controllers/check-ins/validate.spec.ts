import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe('Validate Check-In (e2e)', () => {

  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

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

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id
      }
    })

    const response = await request(app.server).
      patch(`/check-ins/${checkIn.id}/validate`).
      set('Authorization', `Bearer ${token}`).
      send()

    expect(response.status).toEqual(204)

    checkIn = await prisma.checkIn.findFirstOrThrow({
      where: {
        id: checkIn.id
      }
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))

  })
})