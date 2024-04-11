import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { beforeEach, describe, expect, it } from "vitest";

import { CreateGymUseCase } from './create-gym';

let gymRepositories: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepositories = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymRepositories)

  })

  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Academia 01',
      description: 'Academia muito boa',
      latitude: 0,
      longitude: 0,
      phone: '123456789'
    })
    expect(gym.id).toEqual(expect.any(String));
  })

})