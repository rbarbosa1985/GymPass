import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { beforeEach, describe, expect, it } from "vitest";

import { AuthenticateUseCase } from './authenticate';
import { InvalidCredentialsError } from './erros/invalid-credentials-error';

let userRepositories: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepositories = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepositories)
  })

  it('should be able to authenticate', async () => {


    await userRepositories.create({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password_hash: await hash('123456', 6)
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johndoe@exmaple.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String));
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => authenticateUseCase.execute({
      email: 'johndoe@exmaple.com',
      password: '123456'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepositories.create({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password_hash: await hash('123456', 6)
    })

    await expect(() => authenticateUseCase.execute({
      email: 'johndoe@exmaple.com',
      password: '1234567'
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

})