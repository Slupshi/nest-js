import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/utils/decorators/is-public.decorator';

@IsPublic()
@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      if (!loginDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const token = await this.authService.login(loginDto);
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).send('Invalid mail or password');
      }
      return res.status(HttpStatus.OK).send({ accessToken: token });
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    try {
      if (!registerDto) {
        return res.status(HttpStatus.BAD_REQUEST).send('Need body');
      }
      const token = await this.authService.register(registerDto);
      if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).send('Invalid mail or password');
      }
      return res.status(HttpStatus.CREATED).send({ accessToken: token });
    } catch (ex) {
      console.error(ex);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(ex.toString());
    }
  }

}
