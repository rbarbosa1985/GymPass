import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CheckInUseCase } from './check-in';
import { MaxDistanceError } from './erros/max-distance-error';
import { MaxNumberOfCheckInsError } from './erros/max-number-of-check-ins-error';

let checkInRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository, gymsRepository)
    vi.useFakeTimers();

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia 01',
      description: 'Academia muito boa',
      phone: '123456789',
      latitude: 0,
      longitude: 0
    })
  })

  afterEach(() => {
    vi.useRealTimers();

  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })
    expect(checkIn.id).toEqual(expect.any(String));
  })

  it('should not be able to check in twice in the same day', async () => {
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })
    await expect(() => checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice in the different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })

    vi.setSystemTime(new Date(2022, 0, 21, 10, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0
    })
    expect(checkIn.id).toEqual(expect.any(String));
  })

  it('should not be able to check in in on distant gym', async () => {

    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia 02',
      description: 'Academia muito boa',
      phone: '123456789',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672)
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)

  })

})