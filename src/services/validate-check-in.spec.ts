import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository';
import { beforeEach, describe, expect, it } from "vitest";

import { ResourceNotFoundError } from './erros/resource-not-found-error';
import { ValidateCheckInUseCase } from './validate-check-in';

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)
    // vi.useFakeTimers();

    // afterEach(() => {
    //   vi.useRealTimers();

    // })
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

})

