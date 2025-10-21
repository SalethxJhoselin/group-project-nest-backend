import { IsDate, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class RegisterStudentDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsNumber()
    CI: number;

    @IsNumber()
    registration_number: number;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsOptional()
    @IsString()
    phone_number?: string;

    @IsDate()
    birthDate: Date;

    @IsOptional()
    @IsString()
    bio?: string;
}

export class RegisterCompanyDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUrl()
    website?: string;

    @IsOptional()
    @IsString()
    phone_number?: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}