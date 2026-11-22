import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PLATFORM_PATTERNS } from "@nexous-accounting/types";
import { UsersService } from "./users.service";
import { CreateUserDto } from "@nexous-accounting/common";

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @MessagePattern(PLATFORM_PATTERNS.users.create)
  create(@Payload() payload: CreateUserDto) {
    return this.users.create(payload);
  }

  @MessagePattern(PLATFORM_PATTERNS.users.get)
  get(@Payload("id") id: string) {
    return this.users.getById(id);
  }
}
