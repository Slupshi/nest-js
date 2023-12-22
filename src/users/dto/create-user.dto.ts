import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
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

export enum Roles {
    Admin = "ADMIN",
    Manager = "MANAGER",
    Client = "CLIENT",
}
