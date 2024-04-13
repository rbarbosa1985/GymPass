import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from "vitest";

import { SearchGymsUseCase } from './search-gyms';

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gym Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })


  it('should be able to fetch search gym', async () => {
    await gymsRepository.create({
      title: 'gym-01',
      description: 'description',
      phone: 'phone',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      title: 'gym-02',
      description: 'description',
      phone: 'phone',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await sut.execute({
      query: 'gym-01',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'gym-01',
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `gym-${i}`,
        description: 'description',
        phone: 'phone',
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'gym-21',

      }),
      expect.objectContaining({
        title: 'gym-22',
      })
    ])
  })

})