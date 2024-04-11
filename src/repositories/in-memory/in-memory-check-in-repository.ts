import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { CheckInsRepository } from "../check-in-repository";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date() : null
    }

    this.items.push(checkIn)

    return checkIn
  }
}