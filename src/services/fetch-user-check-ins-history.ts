import { CheckInsRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";

interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) { }

  async execute({ userId, page }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId, page)

    return {
      checkIns
    }

  }
}