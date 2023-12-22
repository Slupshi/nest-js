import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Put, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, Roles as RoleEnum } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/utils/decorators/roles.decorator';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles([RoleEnum.Manager])
  async create(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    try {
      if (!createUserDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const newUser = await this.usersService.create(createUserDto);
      return res.status(HttpStatus.CREATED).send(newUser);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get()
  @Roles([RoleEnum.Manager])
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return res.status(HttpStatus.OK).send(users);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Get(':id')
  @Roles([RoleEnum.Manager])
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      const user = await this.usersService.findOne(+id);
      if (!user) {
        return res.status(HttpStatus.NOT_FOUND).send(`User not found for id: ${+id}`);
      }
      return res.status(HttpStatus.OK).send(user);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Patch(':id')
  @Roles([RoleEnum.Manager])
  async update(@Res() res: Response, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      if (!updateUserDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return res.status(HttpStatus.OK).send(updatedUser);
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Delete(':id')
  @Roles([RoleEnum.Manager])
  async remove(@Res() res: Response, @Param('id') id: string) {
    try {
      if (!+id) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need id');
      }
      await this.usersService.remove(+id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }
}
