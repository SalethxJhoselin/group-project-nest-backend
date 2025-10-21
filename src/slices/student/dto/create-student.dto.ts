import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
    @ApiProperty({ example: 12345678 })
    @IsNumber()
    CI: number;

    @ApiProperty({ example: 20230001 })
    @IsNumber()
    registration_number: number;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    first_name: string;

    @ApiProperty({ example: 'Perez' })
    @IsString()
    last_name: string;

    @ApiProperty({ example: '+1234567890', required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
    @IsOptional()
    @IsString()
    profile_photo_url?: string;

    @ApiProperty({ example: '2000-01-01' })
    @IsDate()
    birthDate: Date;

    @ApiProperty({ example: 'estudiante@facultad.edu' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Estudiante de ingeniería...', required: false })
    @IsOptional()
    @IsString()
    bio?: string;
}

export class UpdateStudentDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    first_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone_number?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    profile_photo_url?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    bio?: string;
}