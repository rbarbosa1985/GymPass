import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

import { findManyNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data
    })
    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    })
    return gym
  }

  async searchMany(query: string, page: number) {

  }

  async findManyNearby(params: findManyNearbyParams) {

  }
}