import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { beforeEach, describe, expect, it } from "vitest";

import { UserAlreadyExistsError } from './erros/user-already-exists-error';
import { RegisterUseCase } from "./register";

let userRepositories: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    userRepositories = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(userRepositories)

  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password: '123456'
    })
    expect(user.id).toEqual(expect.any(String));
  })


  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@exmaple.com'
    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456'
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  })

})