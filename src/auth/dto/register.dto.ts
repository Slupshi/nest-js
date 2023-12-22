import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Roles } from "src/users/dto/create-user.dto";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;
    @IsString()
    @IsNotEmpty()
    lastname: string;
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
    @IsString()
    @IsNotEmpty()
    password: string;
    role: Roles;
}
