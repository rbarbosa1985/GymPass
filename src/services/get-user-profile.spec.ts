import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from "vitest";

import { ResourceNotFoundError } from './erros/resource-not-found-error';
import { GetUserProfileUseCase } from './get-user-profile';

let userRepositories: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    userRepositories = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(userRepositories)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await userRepositories.create({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual('John Doe');
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() => getUserProfileUseCase.execute({
      userId: 'non-existing-id',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

})