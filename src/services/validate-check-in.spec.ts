import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LateCheckInValidateError } from './erros/late-check-in-validate-error';
import { ResourceNotFoundError } from './erros/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)
    vi.useFakeTimers();

    afterEach(() => {
      vi.useRealTimers();

    })
  })
  it('should be able to validate check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date));
  })

  it('should be able to validate an inexistent check-in', async () => {

    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id'
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01'
    })

    vi.advanceTimersByTime(1000 * 60 * 21) // 21 minutes em milissegundos

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidateError)

  })
})

