import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getProfile(@GetUser() user: User) {
    return user;
  }
}
