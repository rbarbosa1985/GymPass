import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { GymsRepository } from "../gyms-repository";

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
      created_at: new Date()
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items.filter((item) => item.title.includes(query)).slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby(params: { latitude: number; longitude: number }) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        },
        {
          latitude: params.latitude,
          longitude: params.longitude
        })
      return distance <= 10
    })
  }

}