import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) { }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findOneByMail(loginDto.email);
        if (!user) {
            return null;
        }
        const isSamePassword = bcrypt.compare(loginDto.password, user.password);
        if (!isSamePassword) {
            return null;
        }

        delete user['password'];

        const token = await this.jwtService.signAsync({ user });

        return token;
    }

    async register(registerDto: RegisterDto) {
        const newUser = await this.userService.create(registerDto);

        if (!newUser) {
            return null;
        }

        delete newUser['password'];

        const token = await this.jwtService.signAsync({ newUser });

        return token;
    }
}
