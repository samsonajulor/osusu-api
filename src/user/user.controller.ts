import {
  Controller,
  Delete,
  Get,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserDto } from 'src/common/dtos';
import { Serialize, SerializeResponse } from 'src/common/interceptors';
import { AuthGuard } from 'src/common/guards';

@Controller('user')
@Serialize(UserDto)
@SerializeResponse()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Session() session: any) {
    const user = await this.userService.findById(session.userId);
    return user;
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get('/:userId')
  @UseGuards(AuthGuard)
  async getUser(@Param('userId') userId: string) {
    return this.userService.findById(parseInt(userId));
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('userId') userId: string) {
    await this.userService.delete(parseInt(userId));
    return 'User deleted';
  }
}
