import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"

import { UserAlreadyExistsError } from "./erros/user-already-exists-error"

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export class RegisterUser {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ name, email, password }: RegisterUserRequest) {

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6)

    await this.usersRepository.create({ name, email, password_hash });
  }
}