import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';

@Controller('integrations/user')
export class UserController {
  constructor(private userService: UserService) {}

  @SkipAuth()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
