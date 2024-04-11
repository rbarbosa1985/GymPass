import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { CheckInsRepository } from "../check-in-repository";

export class PrismaCheckInRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id: data.gym_id,
        user_id: data.user_id
      }
    })

    return checkIn
  }
}