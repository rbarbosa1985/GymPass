import { CheckIn, Prisma } from "@prisma/client";


export class InMemoryCheckInRepository {
  public items: CheckIn[] = []

  create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIns = {
      id: 'checkIn_id',
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    }

    this.items.push(checkIns)

    return checkIns
  }

}