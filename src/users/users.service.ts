import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService, prismaExclude } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto | RegisterDto) {
    return await this.prisma.user.create({
      data: {
        firstname: createUserDto.firstname,
        lastname: createUserDto.lastname,
        email: createUserDto.email,
        password: await bcrypt.hash(createUserDto.password, 10),
        role: createUserDto.role,
      }
    });
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: prismaExclude('User', ['password']),
    });
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: prismaExclude('User', ['password']),
    });
  }

  async findOneByMail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({
      where: { id }
    });;
  }
}
