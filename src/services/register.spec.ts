import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { compare } from 'bcryptjs';
import { describe, expect, it } from "vitest";

import { UserAlreadyExistsError } from './erros/user-already-exists-error';
import { RegisterUseCase } from "./register";

describe('Register Use Case', () => {

  it('should be able to register', async () => {
    const userRepositories = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositories)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String));
  })


  it('should hash user password upon registration', async () => {
    const userRepositories = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositories)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@exmaple.com',
      password: '123456'
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  })

  it('should not be able to register with same email twice', async () => {
    const userRepositories = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepositories)

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